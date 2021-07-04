import axios from 'axios';

const fileCreationUrl = `${process.env.REACT_APP_BASE_URL}/api/files/`

class PinRequest {
    constructor(boardId) {
        this.url = `${process.env.REACT_APP_BASE_URL}/api/pins/`
        this.id = boardId
        this.promises = []
    }

    // TODO work with ids and coords instead of pins object.
    onPinsMoveEnd = (pins) => {
        const modifiedPins = {
            actions: pins.map(pin => {
                return {
                    path: pin.id,
                    op: "move",
                    values: { x: pin.x_coordinate, y: pin.y_coordinate }
                }
            })
        }
        axios.patch(this.url, modifiedPins);
    }

    onPinsDelete = (pinIds) => {
        const modifiedPins = {
            actions: pinIds.map(pinId => {
                return {
                    path: pinId,
                    op: "remove",
                }
            })
        }
        axios.patch(this.url, modifiedPins)
    }

    // TODO learn what async is
    // TODO make this async
    onPinCreate = async (pin) => {
        this._onFileCreate(Array.from(pin.image))
        Promise.all(this.promises).then(results => {
            console.log(results);
            const fileIds = results.map(result => result.data.id)
            console.log(fileIds);
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
            axios.post(this.url, pinData)
        } catch (response) {
            const data = response.response.data;
            console.log(data)
        }
    }

    _onFileCreate = (files) => {


        const x = files.map(file => {
            const formData = new FormData();
            formData.append('image', file);
            return axios.post(fileCreationUrl, formData)
        })

        this.promises = x


    }

}

export default PinRequest;