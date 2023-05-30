import React, {useState} from "react";
// import { useState } from "react";

export default function Test() {

  const [x, setX] = useState(0);

  if (x === 0) {
    return(
      <div>
        <div>This is a Test [ZERO] (11)</div>
        <div>Just write anything here</div>
      </div>
    );
  }
  else {
    return(
      <div>
        <div>This is a Test [NOT ZERO] (11)</div>
        <div>Just write anything here</div>
      </div>
    );

  }
}