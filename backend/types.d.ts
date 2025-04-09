// Type declarations for modules without types
declare module 'express' {
    import * as express from 'express';
    export = express;
}

declare module 'cors' {
    import * as cors from 'cors';
    export = cors;
}

// Ensure Node.js globals are available
declare var process: any;
declare var console: any;
