import React, { useState } from "react";

const dialogues = [
  { speaker: "Zero", text: "천재가 사라진 게 아니야. 지금 기준이 후퇴했을 뿐이야." },
  { speaker: "Lumen", text: "그건 기준 탓이 아니야. 시대마다 요구되는 창의성이 다를 뿐이지." },
  { speaker: "Zero", text: "하지만 우리가 천재라 부른 인물들은 지금보다 더 넓은 지형을 개척했지." },
  { speaker: "Lumen", text: "그건 정보가 희소했던 시대였기에 가능했던 일일 수도 있어." }
];

const ZeroLumen = () => {
  const [index, setIndex] = useState(0);

  const nextDialogue = () => {
    if (index < dialogues.length - 1) {
      setIndex(index + 1);
    }
  };

  return (
    <div>
      <p><strong>{dialogues[index].speaker}:</strong> {dialogues[index].text}</p>
      {index < dialogues.length - 1 && (
        <button onClick={nextDialogue}>다음</button>
      )}
    </div>
  );
};

export default ZeroLumen;