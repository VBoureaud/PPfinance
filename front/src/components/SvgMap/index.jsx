import React, { useRef, useEffect, useState } from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';
import Icon, { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from "antd";
// import initial_indexes from "./assets/initial_indexes.json";

// sizeBox
// paddBox
// xNum
// yNum
// onClick
// reload
// loading
// nftTokens
export default function SvgMap(props) {
  const Viewer = useRef(null);
  const [currentPixel, setCurrentPixel] = useState(null);

  const sizeBox = props.sizeBox;
  const paddBox = props.paddBox;
  const xNum = props.xNum;
  const yNum = props.yNum;

  // some random colors
  // const colors = "004b23-006400-007200-008000-38b000-70e000-9ef01a-ccff33".split('-');

  const range = n => Array.from(Array(n).keys())

  useEffect(() => {
    const x = (sizeBox + paddBox) * xNum;
    const y = (sizeBox + paddBox) * yNum;

    if (Viewer && Viewer.current)
      Viewer.current.fitSelection(-x / 2, 0, x, y);
  }, []);

  useEffect(() => {
    if (currentPixel) setCurrentPixel(null);
  }, [props.loading]);

  const getTokenColor = (tokenId) => {
    const emptyColor = '#EEE';
    // const logoToken = 'tomato';

    // Display random colors
    //const randColor = '#' + colors[parseInt(Math.random() * colors.length)];
    
    // Display default Logo 
    /*if (initial_indexes.indexes.indexOf(tokenId) != -1) {
      return logoToken;
    }*/

    // Display minted token
    if (props.nftTokens[tokenId]) {
      const rgb = props.nftTokens[tokenId];
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    return emptyColor;
  }

  const handleReload = () => {
    if (props.reload)
      props.reload();
  }

  const handleClick = (event) => {
    if (event 
      && event.originalEvent
      && event.originalEvent.target
      && event.originalEvent.target.id) {
      const target = event.originalEvent.target;
      const coord = target.id.split('-');
      const x = sizeBox + ((sizeBox + paddBox) * coord[1]);
      const y = sizeBox + ((sizeBox + paddBox) * coord[0]);
      
      // size Windows in svg
      const viewWind = 200;
      setCurrentPixel(target.id);
      Viewer.current.fitSelection(
        x - (sizeBox + paddBox),
        y - (sizeBox + paddBox),
        viewWind,
        viewWind
      );

      if (props.onClick)
        props.onClick({ x: parseInt(coord[1]), y: parseInt(coord[0]) });
    }
  }

  return (
    <div style={{ background: '#CCC' }}>
      <Button style={{ float: 'right', position: 'relative', zIndex: 2, marginTop: '5px', marginRight: '42px', background: '#161718', border: 'none' }} onClick={handleReload}>
        <Icon style={{ color: 'white' }} component={ReloadOutlined} />
      </Button>

      <div>
        {!props.loading && <UncontrolledReactSVGPanZoom
          ref={Viewer}
          //defaultTool="pan"
          background="#CCC"
          SVGBackground="#CCC"
          width={props.width - 10} height={props.height}
          onClick={event => handleClick(event)}
        >
          <svg width={props.width - 100} height={props.height - 250}>
            <g fillOpacity=".5" strokeWidth="4">
              {
                range(xNum * yNum).map((e, key) => {
                  const x = key % xNum;
                  const y = Math.floor(key / yNum);
                  const id = y + '-' + x;
                  const xSize = sizeBox + (sizeBox + paddBox) * x;
                  const ySize = sizeBox + (sizeBox + paddBox) * y;
                  
                  //const newX = tokenId % maxWidth;
                  //const newY = Math.floor(tokenId / maxHeight);

                  return <rect 
                    id={id}
                    key={id}
                    x={xSize}
                    y={ySize}
                    stroke={id === currentPixel ? "#ff2626" : ''}
                    strokeWidth={id === currentPixel ? 1 : 0}
                    width={sizeBox}
                    height={sizeBox}
                    fill={getTokenColor(key)}
                    //fill={'#' + colors[parseInt(Math.random() * colors.length)]}
                  />
                })
              }
            </g>
          </svg>
        </UncontrolledReactSVGPanZoom>}
        {props.loading && 
          <Icon style={{ color: 'white', fontSize: '50px', padding: '50px', margin: 'auto' }} component={LoadingOutlined} />
        }
      </div>
    </div>
  )
}