export default class Player {

  static lastPlayerId = 0;

  //====================================
  constructor(name) {
    this.id = ++Player.lastPlayerId;
    this.name = name;

    this.solvedRiddles = {
      Easy: [],
      Medium: [],
      Hard: []
    };

    this.solvedTimes = {
      Easy: [],
      Medium: [],
      Hard: []
    };
  }

  //--------------------------------------------------------------
  recordTime(difficulty, time) {
    this.solvedTimes[difficulty].push(time);
  }

  //--------------------------------------------------------------
  recordId(difficulty, id) {
    this.solvedRiddles[difficulty].push(id);
  }

  //--------------------------------------------------------------
  getTotalTimeByLevel(difficulty) {
    let sum = 0;
    for (let time of this.solvedTimes[difficulty]) {
      sum += time;
    }
    return sum;
  }

  //--------------------------------------------------------------
  getRiddleCountByLevel(difficulty) {
    return this.solvedRiddles[difficulty].length;
  }

  //--------------------------------------------------------------
  getAvgTime(difficulty) {
    const times = this.solvedTimes[difficulty];
    if (times.length === 0) return 0;
    return (times.reduce((acc, t) => acc + t, 0) / times.length).toFixed(2);
  }

  //--------------------------------------------------------------
  showCompactStats() {
    console.log(`ID: ${this.id}, Name: ${this.name}`);

    console.log(`Easy Riddles: ${this.solvedRiddles.Easy.join(", ")}`);
    console.log(`Medium Riddles: ${this.solvedRiddles.Medium.join(", ")}`);
    console.log(`Hard Riddles: ${this.solvedRiddles.Hard.join(", ")}`);

    const easyAvg = this.getAvgTime("Easy");
    const medAvg = this.getAvgTime("Medium");
    const hardAvg = this.getAvgTime("Hard");

    console.log(`Average Times - Easy: ${easyAvg}s, Medium: ${medAvg}s, Hard: ${hardAvg}s`);
  }
}
