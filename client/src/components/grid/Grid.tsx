import { useEffect, useState } from "react";
import { HeartData } from "../../data/heart";
import { SmileyData } from "../../data/smiley";
import { Service } from "../../service";
import { ColorPicker } from "../color-picker/ColorPicker";
import "./Grid.css";

type Pixel = {
    color: string;
    id: string;
};

export const Grid = () => {
    const [service] = useState(new Service());
    const [pixels, setPixels] = useState<Pixel[]>([]);
    const [pickerShown, setPickerShown] = useState(false);

    const [ele, setEle] = useState(null);
    const [selected, setSelected] = useState("");

    async function getData() {
        const pendingProms = Array.from({ length: 100 }, async (itm, itm2) => {
            return await service.getPixel(itm2.toString());
        });

        const results = await Promise.all(pendingProms);

        const p = [] as Pixel[];
        results.forEach((itm: any, id: number) => {
            if (itm) {
                p.push({
                    color: itm.color,
                    id: id.toString()
                });
            }
        });

        setPixels(p);
    }

    useEffect(() => {
        getData();
    }, []);

    const showPicker = (e: any, id: string) => {
        setSelected(id);
        setEle(e);
        setPickerShown(true);
    };

    const onColorSelected = async (newColor: string) => {
        try {
            await service.setPixel(selected, newColor);

            const cpy = [...pixels];
            cpy.forEach((itm: Pixel) => {
                if (itm.id === selected) {
                    itm.color = newColor;
                }
            });

            setPixels(cpy);
            setPickerShown(false);
        } catch (err) {
            setPickerShown(false);
        }
    };

    const clearAll = async () => {
        const pendingProms = [...pixels].map(async (p: Pixel) => {
            return await service.setPixel(p.id, "#EEEEEE");
        });

        const results = await Promise.all(pendingProms);

        const p = [] as Pixel[];
        results.forEach((itm: any, id: number) => {
            p.push({
                color: "#EEEEEE",
                id: id.toString(),
            });
        });

        setPixels(p);
    };

    const setPredefined = async (type : string) => {

        await clearAll();

        let t = [];
        if(type === "heart") {
            t = HeartData;
        }
        else {
            t = SmileyData;
        }

        const pendingProms = t.map(async (p: Pixel) => {
            return await service.setPixel(p.id, p.color);
        });

        const results = await Promise.all(pendingProms);

        const copyPixels = [...pixels];

        for (let index = 0; index < t.length; index++) {
            const element = t[index];
            await service.setPixel(element.id, element.color);

            copyPixels[Number.parseInt(element.id)] = element;
        }

        setPixels(copyPixels);
    }

    return (
        <>
        {
            pixels.length > 0 
                ? <div>
                    <div className="grid">
                    {
                        pixels.map((itm: Pixel) => (
                            <div
                                key={itm.id}
                                style={{ backgroundColor: `${itm.color}` }}
                                onClick={(e) => showPicker(e, itm.id)}
                            >
                                {itm.id}
                            </div>
                        ))}
                    </div>

                    <div className="buttons">
                        <button onClick={clearAll}>Clear</button>
                        
                        <button className="predefined-button" onClick={ () => setPredefined('heart')}>
                        ❤️ Heart 
                        </button>

                        <button className="predefined-button" onClick={ () => setPredefined('smiley')}>
                        😊 Smiley
                        </button>
                    </div>
                </div>
                : <div className="no-data"><h1>Unable to connect to Server</h1></div>
        }
            
        {
            pickerShown 
                ? <ColorPicker ele={ele} onColorChange={onColorSelected} />
                 : null
        }
        </>
    );
};
