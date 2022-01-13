import { AddAPhoto, Delete, Download, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Badge, IconButton, ListItem, Paper, Select } from "@mui/material";
import { useThree } from "@react-three/fiber";
import { useState } from "react";
import { ScreenshotUtil } from "../util/ScreenshotUtil";
import { IExportSceneProps } from "./IExportSceneProps";
import concat from 'concat-stream';

/**
 * functional react component holding a matertial-ui slider
 * 
 * @author h.fleischer
 * @since 13.01.2021
 */
export default (props: IExportSceneProps) => {

  // const { onScreenshotRequested } = props;
  const [frameCount, setFrameCount] = useState<number>(0);
  const [frameIndex, setFrameIndex] = useState<number>(0);

  /**
   * trigger the onScreenshotRequested callback
   */
  const handleFrameRequested = () => {
    ScreenshotUtil.getInstance().setScreenshotOptions({
      type: 'gif_frame',
      done: handleFrameComplete
    });
  }

  const handleFrameIndexDecr = () => {
    console.log('frameIndex', frameIndex);
    setFrameIndex(frameIndex - 1);
    updateTumbnail();
  }

  const handleFrameIndexIncr = () => {
    console.log('frameIndex', frameIndex);
    setFrameIndex(frameIndex + 1);
    updateTumbnail();
  }

  const handleFrameComplete = () => {
    setFrameCount(ScreenshotUtil.getInstance().getFrameCount());
    setFrameIndex(ScreenshotUtil.getInstance().getFrameCount() - 1);
    updateTumbnail();
  }

  const updateTumbnail = () => {
    document.getElementById('exportSceneDiv').textContent = '';
    document.getElementById('exportSceneDiv').appendChild(ScreenshotUtil.getInstance().getFrame(frameIndex).canvas);
  }

  return (
    <Badge badgeContent={frameCount} color="primary" variant='standard'>

      <Paper elevation={4} style={{ pointerEvents: 'visible', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', minWidth: 'unset', top: frameCount === 0 ? '80px' : '0px', height: frameCount === 0 ? '40px' : '120px', transition: 'all 250ms ease-in-out' }} > { /* 80/40, 0/120 */}

        <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'blue', minHeight: '40px' }}>

          <div id="exportSceneDiv" style={{ width: frameCount === 0 ? '0px' : '132px', margin: '6px 0px 6px 6px', backgroundColor: 'unset', overflow: 'hidden', transition: 'all 250ms ease-in-out' }}>
            {/* <img id="exportSceneImg" style={{ width: '120px', height: '67px', borderStyle: 'none' }} src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" /> */}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ minHeight: '6px' }}></div>
            <IconButton onClick={handleFrameRequested} style={{ width: '30px', height: '28px', color: 'var(--color-text)' }}>
              <AddAPhoto />
            </IconButton>
            <IconButton style={{ width: '30px', height: '28px', color: 'var(--color-text)' }}>
              <Delete />
            </IconButton>
            <div style={{ flexGrow: '10' }}></div>
          </div>
        </div>
        <div style={{ width: frameCount === 0 ? '44px' : 'unset', display: 'flex', flexDirection: 'row', backgroundColor: 'red', height: '28px', overflow: 'hidden', transition: 'all 250ms ease-in-out' }}>

          {/* bottom line where paging and export is done */}

          <IconButton onClick={handleFrameIndexDecr} style={{ width: '30px', height: '28px' }} disabled={frameIndex === 0} >
            <KeyboardArrowLeft style={{ width: '21px', height: '21px', color: frameIndex > 0 ? 'var(--color-text)' : 'black' }} />
          </IconButton>
          <Select style={{ fontSize: '14px', paddingTop: '2px' }} variant='standard' value={200}>
            <ListItem value={200}>200ms</ListItem>
            <ListItem value={500}>500ms</ListItem>
          </Select>
          <IconButton onClick={handleFrameIndexIncr} style={{ width: '30px', height: '28px', color: 'var(--color-text)' }} disabled={frameIndex >= frameCount}>
            <KeyboardArrowRight style={{ width: '21px', height: '21px', color: frameIndex < frameCount ? 'var(--color-text)' : 'black' }} />
          </IconButton>
          <div style={{ flexGrow: '10' }}></div>
          {/* <div style={{ fontSize: '14px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', paddingTop: '3px', paddingLeft: '6px', paddingRight: '3px' }}>~10M</div> */}
          <IconButton style={{ width: '30px', height: '28px', color: 'var(--color-text)' }}>
            <Download />
          </IconButton>

        </div>

      </Paper>
    </Badge >
  );

}