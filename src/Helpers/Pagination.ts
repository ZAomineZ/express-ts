import {Request} from "express";

export class Pagination {
    private _currentPage = 0
    private limit = 0
    private offset: number = 0
    private _pageCount: number = 0

    get currentPage(): number {
        return this._currentPage;
    }

    get pageCount(): number {
        return this._pageCount;
    }

    /**
     * @param request
     * @param results
     * @param classModel
     * @param {number} category
     */
    async paginate (request: Request, results: any, classModel: any, category?: number) {
        // @ts-ignore
        this._currentPage = parseInt(request.query.page)
        this.limit = 10
        this._pageCount = Math.ceil(results.length / this.limit)
        this.offset = this._currentPage === 1 ? 0 : (this.limit * this._currentPage - this.limit)

        return this.paginationData(results)
    }

    /**
     * @param {any} results
     * @private
     */
    private paginationData(results: any) {
        return results.slice(this.offset, this.offset + this.limit)
    }

}