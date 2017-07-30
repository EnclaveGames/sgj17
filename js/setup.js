function setup(imagesBasePaths, numberOfRuns, timeToEndScene){
'use strict'
let currentCorrectSymbolIndex;
const getRandomBasePathWithoutRepetitions = createRandomizerWithoutRepetitions(imagesBasePaths);
const overlay = document.querySelector('#overlay');
const cursor = document.querySelector('#cursor');
const runs = document.querySelectorAll('a-box.symbol');
let intervalId;
console.log(runs);
Array.from(runs).forEach(function(run){
  run.addEventListener('click',function(e){
      const fusedElementId = e.target.getAttribute('id');

      const elemIndex = fusedElementId.replace('symbol', '');
      if(elemIndex==currentCorrectSymbolIndex){
        console.log('win');
        handleNextScene();
      } else {
        console.log('failure');
        handleFailure();
      }
  })

  run.addEventListener('fusing', function(e){
    const fusedElement = e.target;
    console.log(fusedElement);

    fusedElement.emit('on-focus-start');
  })

})


const timerNode = document.querySelector('#timer');

timerNode.addEventListener('on-time-end', function(){
  timerNode.setAttribute('value', 'Drowned!')
  handleFailure();
})

const sceneNode = document.querySelector('a-scene');

sceneNode.addEventListener('end-of-scenes', function(){alert('You won');});



function setupScene(){
    const currentSceneImageBasePath = getRandomBasePathWithoutRepetitions()

    if(!currentSceneImageBasePath){
      sceneNode.emit('end-of-scenes');
      return;
    }

    overlay.emit('light-on');
    console.log(overlay.children, 'emitted');

    setupRuns(currentSceneImageBasePath, numberOfRuns);
    setupTimer(timeToEndScene);
}

function createRandomizerWithoutRepetitions(arr){
return function(){
    const index= Math.floor(Math.random()*arr.length);
    const element = arr[index];

    arr.splice(index ,1);

    return element;
  }
}

function setupRuns(runsImageBasePath, numberOfRuns) {
  if(!runs.length || runs.length != numberOfRuns ){
    throw new Error('Incorrect number of a-run components. Expected numer: '+
    numberOfRuns+', Actual number: '+runs.length)
  }

  const imageFormat = '.png'

  const imagesIndecies = [];
  for(let i = 0; i<numberOfRuns; i++){
    imagesIndecies.push(i)
  }

  const getRandomWithoutRepetitions= createRandomizerWithoutRepetitions(imagesIndecies);

  Array.from(runs).forEach( function(run, runIndex){
    const index=getRandomWithoutRepetitions()
    if(index===0){
      currentCorrectSymbolIndex = runIndex+1;
      console.log('Correct '+runIndex);
    }
    run.setAttribute('src', runsImageBasePath+index+imageFormat)
  })

}

function setupTimer(timeToCompleteLevel){
  let timeLeft=timeToCompleteLevel;

  const getTimerValue = function(value){
    return '0:' + ((value<10)?'0'+value:value);
  }

  timerNode.setAttribute('value', getTimerValue(timeLeft));
  intervalId = setInterval(function(){
    timeLeft--;
    timerNode.setAttribute('value', getTimerValue(timeLeft));
    if(timeLeft === 0){
      clearInterval(intervalId);
      timerNode.emit('on-time-end');
    }
  }, 1000);
}

function handleNextScene(){
  overlay.emit('light-off');
  clearInterval(intervalId)
  setupScene();
}

function handleFailure(){
  clearInterval(intervalId)
}

setupScene();

}
