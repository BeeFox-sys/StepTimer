class Timer{
  constructor(n, d, s){
    this.name = n;
    this.description = d;
    this.steps = s;
    this.length = 0;
    for(var i = 0; i < this.steps.length;i++){
      this.length += this.steps[i].minutes
    }
  }
}

class Step{
  constructor(n, m){
    this.name = n;
    this.minutes = +m;
  }
}
