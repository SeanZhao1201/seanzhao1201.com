const CJK = /[㐀-鿿＀-￯　-〿]/;

// Latin text splits on spaces; CJK text has no spaces, so it splits after
// punctuation into clause-sized chunks so the reveal still reads as a
// cascade rather than one solid block. Match-based rather than a
// lookbehind split: lookbehind throws at runtime on Safari < 16.4.
const split = (text) =>
  CJK.test(text)
    ? text.match(/[^，。、；：！？—～]+[，。、；：！？—～]*|[，。、；：！？—～]+/g) ?? [text]
    : text.split(' ');

export default function Words({ text }) {
  return split(text).map((w, i) => (
    <span className="word" key={i}>
      <span className="word-inner">{w}</span>
    </span>
  ));
}
