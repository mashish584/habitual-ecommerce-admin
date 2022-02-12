import {IncomingMessage} from "http";
import {FileType} from "../utils/types";

declare module 'next' {
    export interface NextApiRequest extends IncomingMessage {
        file?:FileType
    }
  }