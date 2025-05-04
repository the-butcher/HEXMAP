import { Button, FormGroup } from "@mui/material";
import { useEffect } from "react";
import { IFilePickerProps } from "../components/IFilePickerProps";
import { HexagonRepository } from "../data/HexagonRepository";
import { PbfHexagonsLoader } from "../protobuf/PbfHexagonsLoader";

function FilePickerComponent(props: IFilePickerProps) {

    // const ws = createRef<WebSocket>();

    const { onHexagonUpdate } = props;

    useEffect(() => {

        console.debug('✨ setting up web socket');

        // const uid = ObjectUtil.createId();

        // // @ts-expect-error files
        // ws.current = new WebSocket(window.websocketUrl + uid); // "ws://poor-crabs-warn-213-164-24-116.loca.lt/websocketpbf/hexagons/"
        // ws.current.binaryType = "arraybuffer";

        // setConnected(true);

        // ws.current.onclose = () => {
        //     // console.log('socket closed');
        //     setConnected(false);
        // }
        // ws.current.onmessage = function (event) {

        //     console.log('msg', event.data);
        //     const byteArray = new Uint8Array(event.data);
        //     console.log('arr');
        //     const pbfHexagonLoader = new PbfHexagonsLoader();
        //     pbfHexagonLoader.fromData(byteArray).then(pbfHexagons => {
        //         console.log('hex', pbfHexagonLoader.time);
        //         HexagonRepository.getInstance().update(pbfHexagons);
        //         onHexagonUpdate();
        //     });


        // };
        // ws.current.onerror = (e) => {
        //     console.log('socket failure', e);
        //     setConnected(false);
        // };

    }, []);

    // const send = (data: ArrayBuffer) => {

    //     // console.log('file send', data);
    //     ws.current?.send(data);

    // }

    const handleChange = (e: React.ChangeEvent) => {

        // @ts-expect-error files
        const fileCount = e.target.files.length;
        for (let fileIndex = 0; fileIndex < fileCount; fileIndex++) {

            // @ts-expect-error files
            const file = e.target.files[fileIndex];
            if (!file) {
                console.warn('no file');
                return;
            }

            const reader = new FileReader();
            reader.onload = e => {

                console.log('file read', e);
                // send(e.target!.result as ArrayBuffer);

                const uintArray = new Uint8Array(e.target!.result as ArrayBuffer);

                const pbfHexagonLoader = new PbfHexagonsLoader();
                pbfHexagonLoader.fromData(uintArray).then(pbfHexagons => {
                    // console.log('hex', pbfHexagonLoader.time);
                    HexagonRepository.getInstance().update(pbfHexagons).then(zUpdate => {
                        onHexagonUpdate(zUpdate);
                    });

                });


            }
            reader.readAsArrayBuffer(file);

        }



    }

    return (

        <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '999' }}>

            <FormGroup style={{ padding: '9px' }}>
                <input
                    accept="application/x-protobuf, .pbf"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleChange}
                />
                <label htmlFor="raised-button-file">
                    <Button component="span" variant="outlined">
                        Add Content
                    </Button>
                </label>
            </FormGroup>

        </div>

    )

};

export default FilePickerComponent;

