abstract class Controller {

    static EMPTY = 0;
    static DEFAULT_CAMERA = 1;
    static FOCAL_POINT = 2;

    constructor(public type = Controller.EMPTY) { }

    move(target: any) { }

}