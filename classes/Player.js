export default class Player {
  
    //====================================
    constructor(name) {
      this.name = name;
      this.times = {}; 
    }
  
    //--------------------------------------------------------------
    recordTime(id, time) {
        this.times[id] = time;
      }
    
    //--------------------------------------------------------------
    getTotalTime() {
        let sum = 0;
    
        for (let key in this.times) {
          sum = sum + this.times[key];
        }
    
        return sum;
      }

    //--------------------------------------------------------------
    getRiddleCount() {
        return Object.keys(this.times).length;
      }
      
    //--------------------------------------------------------------
    showStats() {
        const totalTime = this.getTotalTime();
        const riddleCount = this.getRiddleCount();
        const avgTime = totalTime / riddleCount;
    
        console.log(`Great job, ${this.name}!
                    Total time: ${totalTime}
                    Average per riddle: ${avgTime}`);
      }
      
  }
  