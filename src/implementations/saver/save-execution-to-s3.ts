import { Saver, SaverResult } from '../../execution/saver';
import { randomId } from '../../utils/random';
import { PutObjectCommand, S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { ExecutionResult } from '../../framework/hyper-execution';
import fs from 'fs';

export class SaveExecutionToS3 extends Saver<ExecutionResult> {

    private S3Client : S3Client

    constructor(private bucket: string) {
        super();
        this.S3Client = new S3Client();
    }

    private uploadLocalPathToRemote(localPath: string, remotePath: string) {
        const relativePath = localPath.split(process.cwd() + '/')[1]
        return this.S3Client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: remotePath,
            Body: fs.readFileSync(relativePath)
        }));
    }

    private uploadRawStringToRemote(data: string, remotePath: string) {
        return this.S3Client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: remotePath,
            Body: data
        }));
    }

    private buildUrlForPath(path: string) {
        return `https://us-west-2.console.aws.amazon.com/s3/object/${this.bucket}?region=us-west-2&bucketType=general&prefix=${path}`
    }

    protected async saveRaw(value: ExecutionResult): Promise<SaverResult> {
        const promises = [];

        // Also upload all the assets
        for (const [label, asset] of Object.entries(value.assets)) {
            let path = `assets/${randomId()}`;
            if (asset.type === 'image') {
                path += '.png';
            }
            promises.push(this.uploadLocalPathToRemote(asset.accessUrl, path));
            value.assets[label].accessUrl = this.buildUrlForPath(path);
        }

        await Promise.all(promises);

        // Then upload the execution json itself
        const rawExecutionData = JSON.stringify(value, null, 2);
        const path = `executions/${randomId()}.json`;
        promises.push(this.uploadRawStringToRemote(rawExecutionData, path));

        await Promise.all(promises);

        return {
            accessUrl: this.buildUrlForPath(path)
        };

    }
}
