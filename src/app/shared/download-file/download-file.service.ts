
import * as FileSaver  from 'file-saver';
import { Injectable } from '@angular/core';

@Injectable()
export class DownloadFileService {
    fetchFile(data){
        var content=this.base64ToArrayBuffer(data.content);
        var blob = new Blob([content], { type: data.contentType});
        var filename = data.title;
        var url= window.URL.createObjectURL(blob);
        FileSaver.saveAs(blob, filename);
      }
      
      base64ToArrayBuffer(base64) {
        var binaryString =  window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++)        {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
      }

}