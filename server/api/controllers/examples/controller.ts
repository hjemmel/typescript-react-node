import ExamplesService from "../../services/examples.service";
import { Request, Response } from "express";
import HttpStatus from "http-status-codes";

export class Controller {
    all(req: Request, res: Response): void {
        ExamplesService.all().then((r) => res.json(r));
    }

    byId(req: Request, res: Response): void {
        ExamplesService.byId(Number(req.params.id)).then((r) => {
            if (r) res.json(r);
            else res.status(HttpStatus.NOT_FOUND).end();
        });
    }

    create(req: Request, res: Response): void {
        ExamplesService.create(req.body.name).then((r) =>
            res
                .status(HttpStatus.CREATED)
                .location(`/api/v1/examples/${r.id}`)
                .json(r)
        );
    }
}
export default new Controller();
