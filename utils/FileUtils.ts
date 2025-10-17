import * as fs from "fs";

export class FileUtils {
  public static async deleteFilesInDownloadsFolder(): Promise<void> {
    const downloadsFolder = "./downloads";
    const fs = require("fs");
    const path = require("path");

    if (fs.existsSync(downloadsFolder)) {
      const files = fs.readdirSync(downloadsFolder);
      for (const file of files) {
        fs.unlinkSync(path.join(downloadsFolder, file));
      }
    }
  }
}
