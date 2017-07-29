const imageFormat = '.png'

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

  Array.from(runs).forEach( function(run){
    const index=getRandomWithoutRepetitionsInRange()
    run.setAttribute('src', runsImageBasePath+index+imageFormat)
  })

}
