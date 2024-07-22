// @ts-ignore
import { Compact } from '@subsquid/scale-codec';
import * as fs from 'fs';
import * as path;

// @ts-ignore
function serializeWasmFile(wasmFilePath: string): string {
    // Read the WASM file into a buffer
    const wasmBuffer = fs.readFileSync(path.resolve(wasmFilePath));
 
    // Convert the buffer to a byte array
    const bytes = Uint8Array.from(wasmBuffer);
 
    // Use SCALE codec Compact to encode the byte array
    const encoded = new Compact(bytes)._encoded.length;
 
    console.log('encoded:', encoded);

    //Then here goes your implementation to add to the binary file or send it over the network
}

serializeWasmFile("path_to_your_file.wasm");