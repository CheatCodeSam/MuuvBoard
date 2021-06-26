import axios from 'axios';



class PinRequest {
    constructor(boardId) {
        this.url = `${process.env.REACT_APP_BASE_URL}/api/boards/${boardId}/pins/`
        this.id = boardId
    }

    // TODO work with ids and coords instead of pins object.
    onPinsMoveEnd = (pins) => {
        const modifiedPins = {
            pins: pins.map(pin => {
                return {
                    id: pin.id,
                    action: "move",
                    movement: { x: pin.x_coordinate, y: pin.y_coordinate }
                }
            })
        }
        axios.patch(this.url, modifiedPins);
    }

    onPinsDelete = (pinIds) => {
        const modifiedPins = {
            pins: pinIds.map(pinId => {
                return {
                    id: pinId,
                    action: "delete",
                }
            })
        }
        axios.patch(this.url, modifiedPins)
    }

    onPinCreate = (pin) => {
        const formData = new FormData();
        formData.append('title', pin.title);
        formData.append('image', pin.image);
        formData.append('x_coordinate', pin.x_coordinate);
        formData.append('y_coordinate', pin.y_coordinate);
        formData.append('board', this.id);
        try {
            axios.post(this.url, formData)
        } catch (response) {
            const data = response.response.data;
            console.log(data)
        }
    }

}

export default PinRequest;