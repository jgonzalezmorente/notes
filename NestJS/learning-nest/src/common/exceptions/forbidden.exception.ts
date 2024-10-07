import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
    constructor() {
        super('Mi Custom Forbidden message', HttpStatus.FORBIDDEN);
    }
}