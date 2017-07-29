'use strict'
const cursor = document.querySelector('#cursor');

cursor.addEventListener('click', function(e){
  const fusedElementId = e.detail.intersectedEl.id;
  if(!fusedElementId.match(/door[0-9]+/)){
    return;
  }
  console.log('On door focus end: '+fusedElementId.replace('door', ''));
})

cursor.addEventListener('fusing', function(e){
  const fusedElementId = e.detail.intersectedEl.id;
  if(!fusedElementId.match(/door[0-9]+/)){
    return;
  }
  console.log('On door hover: '+fusedElementId.replace('door', ''));
})

function createRandomizerWithoutRepetitionsInRange(begin, end){
  if(begin>end){
    const tmp = begin;
    begin= end;
    end = tmp;
  }

  const numbers = [];
  for(let i=begin; i<end; i++){
    numbers.push(i);
  }

  return function(){
    const numberIndex= Math.floor(Math.random()*numbers.length);
    const number = numbers[numberIndex];

    numbers.splice(numberIndex ,1);

    return number;
  }
}

function setupRuns(runsImageBasePath, numberOfRuns) {
  const runs = document.querySelectorAll('a-box.door');

  if(!runs.length || runs.length != numberOfRuns ){
    throw new Error('Incorrect number of a-run components. Expected numer: '+
    numberOfRuns+', Actual number: '+runs.length)
  }

  const getRandomWithoutRepetitionsInRange = createRandomizerWithoutRepetitionsInRange(0, numberOfRuns);

  const imageFormat = '.png'

  Array.from(runs).forEach( function(run){
    const index=getRandomWithoutRepetitionsInRange()
    run.setAttribute('src', runsImageBasePath+index+imageFormat)
  })

}

const timerNode = document.querySelector('#timer');

function setupTimer(timeToCompleteLevel){
  let timeLeft=timeToCompleteLevel;

  const getTimerValue = function(value){
    return '0:' + ((value<10)?'0'+value:value);
  }

  timerNode.setAttribute('value', getTimerValue(timeLeft));
  const intervalId = setInterval(function(){
    timeLeft--;
    timerNode.setAttribute('value', getTimerValue(timeLeft));
    if(timeLeft === 0){
      clearInterval(intervalId);
      timerNode.emit('on-time-end');
    }
  }, 1000);
}

timerNode.addEventListener('on-time-end', function(){
  timerNode.setAttribute('value', 'Drowned!')
})
