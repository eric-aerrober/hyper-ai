import { Saver, SaverResult } from '../../execution/saver';
import { randomId } from '../../utils/random';
import { ExecutionResult } from '../../framework/hyper-execution';
import fs from 'fs';

export class SaveToOutputDirectory extends Saver<ExecutionResult> {

    constructor(private outputDir: string) {
        super();

        // Create the output directory if it doesn't exist
        fs.mkdirSync(outputDir, { recursive: true });
        
        // Remove all files in the output directory
        fs.readdirSync(outputDir).forEach((file) => {
            fs.unlinkSync(`${outputDir}/${file}`);
        });
    }

    private moveLocalPathToOutPath(localPath: string, outPath: string) {
        const relativePath = localPath.split(process.cwd() + '/')[1]
        return fs.promises.copyFile(relativePath, outPath);
    }

    private saveRawToOutPath(data: string, outPath: string) {
        return fs.promises.writeFile(outPath, data);
    }

    protected async saveRaw(value: ExecutionResult): Promise<SaverResult> {
        const promises = [];
        const valueCopy = JSON.parse(JSON.stringify(value));

        // Also upload all the assets
        const paths = []
        for (const [label, asset] of Object.entries(value.assets)) {
            let path = `${this.outputDir}/${randomId()}`;
            if (asset.type === 'image') {
                path += '.png';
            }
            promises.push(this.moveLocalPathToOutPath(asset.accessUrl, path));
            paths.push([path, label]);
        }

        await Promise.all(promises);

        for (let [path, label] of paths) {
            const absolutePath = 'file://' + fs.realpathSync(path);
            valueCopy.assets[label].accessUrl = absolutePath;
        }

        // Then upload the execution json itself
        const rawExecutionData = JSON.stringify(valueCopy, null, 2);
        const path = `${this.outputDir}/execution.json`;
        promises.push(this.saveRawToOutPath(rawExecutionData, path));
    
        await Promise.all(promises);
        const absolutePath = fs.realpathSync(path)

        return {
            accessUrl: absolutePath
        };

    }
}
