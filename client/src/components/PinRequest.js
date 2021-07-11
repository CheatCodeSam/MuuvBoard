import axios from 'axios';

const fileCreationUrl = `${process.env.REACT_APP_BASE_URL}/api/files/`

class PinRequest {
    constructor(boardId, token) {
        this.url = `${process.env.REACT_APP_BASE_URL}/api/pins/`
        this.id = boardId
        this.promises = []
        this.token = token
    }

    // TODO work with ids and coords instead of pins object.
    onPinsMoveEnd = (pins) => {
        const modifiedPins = pins.map(pin => {
            return {
                path: pin.id,
                op: "move",
                values: { x: pin.x_coordinate, y: pin.y_coordinate }
            }
        })
        axios.patch(this.url, modifiedPins, {
            headers: {
                'Authorization': `token ${this.token}`
            }
        });
    }

    onPinsDelete = (pinIds) => {
        const modifiedPins = pinIds.map(pinId => {
            return {
                path: pinId,
                op: "remove",
            }
        })
        axios.patch(this.url, modifiedPins, {
            headers: {
                'Authorization': `token ${this.token}`
            }
        })
    }

    onSearch = async (query) => {
        const searchUrl = `${this.url}?search=${query}&board=${this.id}`
        return axios.get(searchUrl, {
            headers: {
                'Authorization': `token ${this.token}`
            }
        })
    }

    // TODO learn what async is
    // TODO make this async
    onPinCreate = async (pin) => {
        this._onFileCreate(Array.from(pin.image))
        Promise.all(this.promises).then(results => {
            const fileIds = results.map(result => result.data.id)
            this._onPinCreate(pin, fileIds)


        })




    }

    _onPinCreate = (pin, files) => {
        const pinData = {
            title: pin.title,
            images: files,
            x_coordinate: pin.x_coordinate,
            y_coordinate: pin.y_coordinate,
            board: this.id
        }

        try {
            axios.post(this.url, pinData, {
                headers: {
                    'Authorization': `token ${this.token}`
                }
            })
        } catch (response) {
            const data = response.response.data;
            console.log(data)
        }
    }

    _onFileCreate = (files) => {


        const x = files.map(file => {
            const formData = new FormData();
            formData.append('image', file);
            return axios.post(fileCreationUrl, formData, {
                headers: {
                    'Authorization': `token ${this.token}`
                }
            })
        })

        this.promises = x


    }

}

export default PinRequest;