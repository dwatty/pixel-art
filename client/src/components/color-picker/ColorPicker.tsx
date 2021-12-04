import { useEffect, useRef, useState } from "react";
import './ColorPicker.css';

interface IProps {
    ele: any;
    onColorChange: any;
}

export const ColorPicker = (props: IProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [width] = useState(200);
    const [height] = useState(200);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [picker, setPicker] = useState({ x: 10, y: 10, width: 7, height: 7 });
    const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>();

    const onMouseDown = (e: any) => {
        let currentX = e.clientX - props.ele.clientX
        let currentY = e.clientY - props.ele.clientY;
        setIsMouseDown(true);

        if (
            currentY > picker.y &&
            currentY < picker.y + picker.width &&
            currentX > picker.x &&
            currentX < picker.x + picker.width
        ) {
            setIsMouseDown(true);
        } else {
            const tmpPicker = { ...picker };

            tmpPicker.x = currentX - 10;
            tmpPicker.y = currentY  - 10;

            setPicker(tmpPicker);
        }
    };

    const mouseDownRef = useRef(onMouseDown);
    useEffect(() => {
        mouseDownRef.current = onMouseDown;
    });

    const onMouseMove = (e: any) => {
        if (isMouseDown) {

            let currentX = e.clientX - props.ele.clientX;
            let currentY = e.clientY - props.ele.clientY;

            const tmpPicker = { ...picker };

            tmpPicker.x = currentX - 10;
            tmpPicker.y = currentY - 10;

            setPicker(tmpPicker);
            console.log('moving');
        }
    };

    const mouseMoveRef = useRef(onMouseMove);
    useEffect(() => {
        mouseMoveRef.current = onMouseMove;
    });

    const onMouseUp = () => {
        setIsMouseDown(false);
        getPickedColor();
    };

    const mouseUpRef = useRef(onMouseUp);
    useEffect(() => {
        mouseUpRef.current = onMouseUp;
    });

    const build = (overrideCtx?: CanvasRenderingContext2D) => {
        if (canvasCtx || overrideCtx) {
            const ctx = canvasCtx ?? (overrideCtx as CanvasRenderingContext2D);
            let gradient = ctx.createLinearGradient(0, 0, width, 0);

            //Color Stops
            gradient.addColorStop(0, "rgb(255, 0, 0)");
            gradient.addColorStop(0.15, "rgb(255, 0, 255)");
            gradient.addColorStop(0.33, "rgb(0, 0, 255)");
            gradient.addColorStop(0.49, "rgb(0, 255, 255)");
            gradient.addColorStop(0.67, "rgb(0, 255, 0)");
            gradient.addColorStop(0.84, "rgb(255, 255, 0)");
            gradient.addColorStop(1, "rgb(255, 0, 0)");
            //Fill it
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            //Apply black and white
            gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 1)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            //Circle
            ctx.beginPath();
            ctx.arc(picker.x, picker.y, picker.width, 0, Math.PI * 2);
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.closePath();
        }
    };

    useEffect(() => {
        console.log(props.ele);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            setCanvasCtx(ctx);
            build(ctx);
        }

        const mdcb = (e: any) => mouseDownRef.current(e);
        window.addEventListener("mousedown", mdcb);

        const mmcb = (e: any) => mouseMoveRef.current(e);
        window.addEventListener("mousemove", mmcb);

        const mucb = (e: any) => mouseUpRef.current();
        window.addEventListener("mouseup", mucb);

        return () => {
            window.removeEventListener("mousedown", mdcb);
            window.removeEventListener("mousemove", mmcb);
            window.removeEventListener("mouseup", mucb);
        };
    }, []);

    useEffect(() => {
        build();
    }, [picker]);

    const colorToHex = (color: number) => {
        var hexadecimal = color.toString(16);
        return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
    };

    const convertRGBtoHex = (red: number, green: number, blue: number) => {
        return "#" + colorToHex(red) + colorToHex(green) + colorToHex(blue);
    };

    const getPickedColor = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            let imageData = ctx.getImageData(picker.x, picker.y, 1, 1);

            const colorStr = convertRGBtoHex(
                imageData.data[0],
                imageData.data[1],
                imageData.data[2]
            );

            props.onColorChange(colorStr);
        }
    };

    return (
        <div 
        className="color-picker" style={{ 
            position: 'absolute',
            top: props.ele.clientY, 
            left: props.ele.clientX 
        }} >
            <canvas                     
                ref={canvasRef} 
                width="200" 
                height="200" />
        </div>
    );
};
