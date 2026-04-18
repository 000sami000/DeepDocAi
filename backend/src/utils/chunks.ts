import PDFParser from "pdf2json";

import { v4 as uuidv4 } from "uuid";
import { ChunkPayload } from "../types.js";

export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]+/g, "")
    .replace(/([A-Za-z0-9])\s+(?=[A-Za-z0-9])/g, "$1")
    .replace(/\s+([.,;:!%?])/g, "$1")
    .replace(/([.,;:!%?])([^\s])/g, "$1 $2")
    .trim();
}

export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

const extractTextFromPage = (page: any): string => {
  let pageText = "";

  if (!page.Texts || !Array.isArray(page.Texts)) return pageText;

  page.Texts.forEach((txt: any) => {
    if (txt.R && Array.isArray(txt.R)) {
      txt.R.forEach((r: any) => {
        try {
          pageText += decodeURIComponent(r.T) + " ";
        } catch {
          pageText += (r.T || "") + " ";
        }
      });
    }
  });

  return pageText + "\n"; 
};


const extractTextFromPDF = (pdfData: any): string => {
  let fullText = "";

  if (!pdfData.Pages || !Array.isArray(pdfData.Pages)) return fullText;

  pdfData.Pages.forEach((page: any) => {
    fullText += extractTextFromPage(page);
  });

  return fullText;
};

/*
export const extractAndChunkPDF = (pdfBuffer: Buffer): Promise<ChunkPayload[]> => {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (err) => {
        reject(new Error(`PDF parsing failed: ${err}`));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const rawText = extractTextFromPDF(pdfData);
          const fullText = cleanText(rawText);

          if (!fullText.trim()) {
            throw new Error("No text content found in PDF");
          }

        
          const textChunks = chunkText(fullText, 300, 50);

          
          const chunks: ChunkPayload[] = textChunks.map((content, index) => ({
            chunkId: `chunk_${Date.now()}_${index}`,
            content,
            order: index,
            // page: undefined, 
          }));

          resolve(chunks);
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.parseBuffer(pdfBuffer);
    } catch (err) {
      reject(err);
    }
  });
};
*/


export const extractAndChunkPDF = (
  pdfBuffer: Buffer
): Promise<ChunkPayload[]> => {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser();
      const documentId = uuidv4()
      pdfParser.on("pdfParser_dataError", (err) => {
        reject(new Error(`PDF parsing failed: ${err}`));
      });
 
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          if (!pdfData.Pages || !Array.isArray(pdfData.Pages)) {
            throw new Error("Invalid PDF structure");
          }
 
          const allChunks: ChunkPayload[] = [];
          let globalChunkIndex = 0;
          const timestamp = Date.now();
 
       
          pdfData.Pages.forEach((page: any, pageIndex: number) => {
            const pageNumber = pageIndex + 1; 
            const rawText = extractTextFromPage(page);
            const fullText = cleanText(rawText);
 
           
            if (!fullText.trim()) {
              return;
            }
 
            const textChunks = chunkText(fullText, 500, 50);
 
       
            textChunks.forEach((content, chunkIndexInPage) => {
              const chunk: ChunkPayload = {
                chunkId: `chunk_${timestamp}_${globalChunkIndex}`,
                content,
                order: globalChunkIndex,
                pageNumber: pageNumber,
                chunkIndexInPage: chunkIndexInPage,
                documentId: documentId,
              };
              allChunks.push(chunk);
              globalChunkIndex++;
            });
          });
 
          if (allChunks.length === 0) {
            throw new Error("No text content found in PDF");
          }
 
          resolve(allChunks);
        } catch (err) {
          reject(err);
        }
      });
 
      pdfParser.parseBuffer(pdfBuffer);
    } catch (err) {
      reject(err);
    }
  });
};


// export const extractPagesByPage = (
//   pdfBuffer: Buffer
// ): Promise<PageChunkResult[]> => {
//   return new Promise((resolve, reject) => {
//     try {
//       const pdfParser = new PDFParser();
 
//       pdfParser.on("pdfParser_dataError", (err) => {
//         reject(new Error(`PDF parsing failed: ${err}`));
//       });
 
//       pdfParser.on("pdfParser_dataReady", (pdfData) => {
//         try {
//           if (!pdfData.Pages || !Array.isArray(pdfData.Pages)) {
//             throw new Error("Invalid PDF structure");
//           }
 
//           const pageResults: PageChunkResult[] = [];
//           const timestamp = Date.now();
//           let globalChunkIndex = 0;
 
//           // Process each page
//           pdfData.Pages.forEach((page: any, pageIndex: number) => {
//             const pageNumber = pageIndex + 1;
//             const rawText = extractTextFromPage(page);
//             const fullText = cleanText(rawText);
 
//             if (!fullText.trim()) {
//               return; // Skip empty pages
//             }
 
//             const textChunks = chunkText(fullText, 300, 50);
 
//             const chunks: ChunkPayload[] = textChunks.map(
//               (content, chunkIndexInPage) => ({
//                 chunkId: `chunk_${timestamp}_${globalChunkIndex++}`,
//                 content,
//                 order: globalChunkIndex - 1,
//                 pageNumber: pageNumber,
//                 chunkIndexInPage: chunkIndexInPage,
              
//               })
//             );
 
//             pageResults.push({
//               pageNumber: pageNumber,
//               text: fullText,
//               chunks: chunks,
//             });
//           });
 
//           if (pageResults.length === 0) {
//             throw new Error("No text content found in PDF");
//           }
 
//           resolve(pageResults);
//         } catch (err) {
//           reject(err);
//         }
//       });
 
//       pdfParser.parseBuffer(pdfBuffer);
//     } catch (err) {
//       reject(err);
//     }
//   });
// };