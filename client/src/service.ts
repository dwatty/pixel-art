export class Service {
    private _url = "http://localhost:5000/api/pixel";

    public async getPixel(id: string) {
        //try {
            const reqUrl = `${this._url}/${id}`;
            return await fetch(reqUrl)
                .then((res) => res.json())
                .catch((err) => console.log(err));
        // } catch (err) {
        //     console.log(`Failed to get pixel ${id}`);
        // }
    }

    public async setPixel(id: string, color: string) {
        const reqUrl = `${this._url}/${id}`;
        return await fetch(reqUrl, {
            headers: {
                Accept: "application/json, text/plain",
                "Content-Type": "application/json;charset=UTF-8",
            },
            method: "PUT",
            body: JSON.stringify({
                color: color,
                id: id,
            }),
        }).catch((err) => {
            console.error(err);
            throw err;
        });
    }
}
