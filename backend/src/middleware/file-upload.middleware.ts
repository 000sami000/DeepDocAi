import busboyFactory from "busboy";
import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";

export interface FileData {
  filename: string;
  buffer: Buffer;
  mimetype?: string;
}

declare global {
  namespace Express {
    interface Request {
      file?: FileData;
    }
  }
}


export const parseFileUpload = (
  maxFileSize: number = 10 * 1024 * 1024 
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
  
    if (!req.is("multipart/form-data")) {
      return next();
    }

    const busboy = busboyFactory({
      headers: req.headers as IncomingHttpHeaders,
      limits: {
        fileSize: maxFileSize,
      },
    });

    let fileBuffer = Buffer.alloc(0);
    let fileName = "";
    let fileReceived = false;
    let errorOccurred = false;

    busboy.on("file", (fieldname, file, filename) => {
      fileReceived = true;
      fileName = filename.filename;

      file.on("data", (data: Buffer) => {
        fileBuffer = Buffer.concat([fileBuffer, data]);
      });

      file.on("error", (err) => {
        errorOccurred = true;
        console.error(`File stream error for ${fileName}:`, err);
        if (!res.headersSent) {
          res.status(400).json({ error: "File upload failed", details: err.message });
        }
      });

      file.on("limit", () => {
        errorOccurred = true;
        console.error(`File size exceeded for ${fileName}`);
        if (!res.headersSent) {
          res.status(413).json({ error: "File too large", maxSize: `${maxFileSize / 1024 / 1024}MB` });
        }
      });
    });

    busboy.on("error",  (err) => {
      errorOccurred = true;
      console.error("Busboy error:", err);
      if (!res.headersSent) {
        res.status(400).json({ error: "Request parsing failed", details:  JSON.stringify(err) });
      }
    });

    busboy.on("finish", () => {
      if (errorOccurred) {
        return; 
      }

      if (!fileReceived || fileBuffer.length === 0) {
        return res.status(400).json({ error: "No file provided" });
      }

      req.file = {
        filename: fileName,
        buffer: fileBuffer,
        mimetype: req.get("content-type") || "application/octet-stream",
      };

      next();
    });

    req.pipe(busboy);
  };
};