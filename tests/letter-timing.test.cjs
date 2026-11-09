const {test} = require('node:test');
const assert = require('node:assert/strict');
require('../letter-timing.js');
const {createCues, snapshot, formatTime} = global.LetterTiming;
const entries = [{text:'Gửi em'}, {text:'Một dòng dài hơn để đọc chậm một chút.'}, {text:'Thương em'}, {text:'Anh của em'}];
const cues = createCues(entries,41,205);

test('starts at the requested song position and leaves time for the signature', () => {
  assert.equal(cues[0].time,41);
  assert.ok(cues.at(-1).time < 201);
  assert.equal(snapshot(cues,40,41,205).visible,0);
  assert.equal(snapshot(cues,41,41,205).visible,1);
});
test('seeking backward recomputes visible lines without keeping future text', () => {
  assert.equal(snapshot(cues,200,41,205).visible,4);
  assert.equal(snapshot(cues,41,41,205).visible,1);
  assert.equal(snapshot(cues,41,41,205).elapsed,0);
});
test('invalid or out-of-range clock values cannot reveal or overrun the letter', () => {
  assert.equal(snapshot(cues,-1,41,205).visible,0);
  assert.equal(snapshot(cues,NaN,41,205).elapsed,0);
  assert.equal(snapshot(cues,91.5,41,205).elapsed,50.5);
});
test('the end reveals all entries and clamps progress after playback', () => {
  assert.deepEqual(snapshot(cues,205,41,205),{visible:4,elapsed:164,finished:true});
  assert.equal(snapshot(cues,300,41,205).elapsed,164);
});
test('custom offsets are relative to 0:41, bounded and monotonic', () => {
  const manual = createCues([{text:'one',at:0},{text:'two',at:12},{text:'three',at:3},{text:'four',at:999}],41,205);
  assert.deepEqual(manual.map(cue=>cue.time),[41,53,53,205]);
});
test('metadata duration changes redistribute automatic cues', () => {
  const longer = createCues(entries,41,300);
  assert.ok(longer[1].time > cues[1].time);
  assert.equal(formatTime(41),'0:41');
  assert.equal(formatTime(205.9),'3:25');
  assert.deepEqual(createCues([],41,205),[]);
});
test('current sentence advances at phrase boundaries and follows backward seeks', () => {
  const phrases=createCues([{text:'Lời chào',at:0},{text:'Câu thứ nhất',at:2},{text:'Câu thứ hai',at:9}],0,164.52);
  const active=time=>snapshot(phrases,time,0,164.52).visible-1;
  assert.equal(active(1.99),0);
  assert.equal(active(2),1);
  assert.equal(active(50),2);
  assert.equal(active(2.5),1);
  assert.equal(phrases[active(2.5)+1].text,'Câu thứ hai');
});
test('sample letter uses explicit phrase cues inside the cropped audio', () => {
  const fs=require('node:fs'); const vm=require('node:vm');
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../content.js'),'utf8'),context);
  const content=context.window.CARD_CONTENT;
  assert.equal(content.music.sourceOffsetSeconds,41);
  assert.equal(content.music.startSeconds,0);
  assert.equal(content.letterLines[0].at,2);
  const markers=[content.greetingAt,...content.letterLines.map(line=>line.at),content.signoffAt,content.signatureAt];
  assert.ok(markers.every((t,i)=>Number.isFinite(t) && t>=0 && t<content.music.durationSeconds && (!i || t>markers[i-1])));
  assert.ok(fs.existsSync(require('node:path').join(__dirname,'..',content.music.src)));
});
