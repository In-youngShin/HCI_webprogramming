
/************************* LIST OF CONSTANTS *****************************/
// Page type enumerator
const Page = {
    QUESTION: 1,
    PAUSE: 2
  };
  
  const timerLength = 30;
  const QBoxXSize = 250;
  const QBoxYSize = 100;
  const HOVERTHRESHOLD = 100;
  const FRAMESECOND = 60;
  
  // Initialized in the SetupFunction
  var ThreeBox;
  
  // /**************************************************************************/
  
  
  
  let questionCount = 0;
  let answers = [] //pass to questions.html
  let displayPage = Page.QUESTION;
  let currentPage = null;
  
  let questionText = 
    ["What is your favorite study spot?", 
    "What is your favorite dining hall?", 
    "How many stickers do you have on your computer?", 
    "How important are song lyrics to you?",
    "What is the best CS class at Yale?"]
  
  let option1=
    ["Bass Library", 
    "Saybrook", 
    "No stickers", 
    "Not super important",
    "CS50"]
  
  let option2=
    ["The Good Life Center", 
    "Commons", "A few stickers", 
    "Neutral", 
    "CPSC 484:HCI"]
  
  let option3=
    ["Tsai City", 
    "Timothy Dwight", 
    "Lots of stickers", 
    "VERY important", 
    "CPSC 323"]
  
  var global_var= {
    position: null,
    time:null,
  };
  
  // //////////////////////////////////////////////////
  
  class ResultPage {
    constructor(canvasWidth, canvasHeight, img) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.selectedRect = -1;
      this.hoverTime = 0;
      this.timer = timerLength
      this.fantext = "";
      this.counttext = "";
      this.img = img;
  
      this.THREEBOX = {
        LEFT: {
          XPOS: canvasWidth/10,
          YPOS: canvasHeight/2
        },
        MIDDLE: {
          XPOS: (canvasWidth/10)*4,
          YPOS: canvasHeight/2
        },
        RIGHT: {
          XPOS: (canvasWidth/10)*7,
          YPOS: canvasHeight/2
        }
      };
    }
  
    populate(data) {
      this.fantext = data[0];
      this.counttext = data[1];
    }
    //writing any contents including title, timer and desc
    drawText(content, xpos, ypos, ts) {
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(ts);
      text(content, xpos, ypos);
    }
    
    drawQuestionBox(selected, content, xpos, ypos) {
        // Draw box
        if (selected) fill(255, 0, 0);
        else fill(0, 0, 200);
        rect(xpos, ypos, QBoxXSize, QBoxYSize);
    
        // Write text
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(content, xpos+QBoxXSize/2, ypos+QBoxYSize/2);
    }
    
    draw() {
      background(250, 250, 250);
  
      this.drawText("Result", this.canvasWidth / 2, this.canvasHeight / 20);
      this.drawText(this.fantext, this.canvasWidth / 2, this.canvasHeight/3 - 90, 40);
      this.drawText(this.counttext, this.canvasWidth / 2, this.canvasHeight/3 - 40, 40);
      this.drawText("Check out the playlist, 'What's AKW Listening To?'", this.canvasWidth / 2, this.canvasHeight/3 + 10, 40);
      image(qrcode,this.canvasWidth / 2 - 125, this.canvasHeight / 3 + 70, 250, 250);
      this.drawText("This game will restart in " + this.timer + " seconds", this.canvasWidth / 2, this.canvasHeight - 100);
    }
  
    update() {
      // Wait 30 seconds and return -3 ---> go back to instructions page.
      if (frameCount % FRAMESECOND == 0) this.timer--;
      if (this.timer <= 0) return -3;
      return -1;
    }
  
    run() {
      this.draw();
      circle(mouseX, mouseY, 30);
      return this.update();
    }
  
    // In Question Window, detect if mouse is seleting a box
    // later, mouseXPos, mouseYPos will be replaced with motion (left middle right), 
    //this.THREEBOX.xxxx.XPOS, this.THREEBOX.Lxxxx.YPOS, QBoxXSize, QBoxYSize will be replaced with THREEBOX.xxxx()
    mouseIsSelectingInQuestionWindow(mouseXPos, mouseYPos) {
    }
  }
  
  class SelectPage {
    constructor(qnum, title, desc, boxCount, options, optionIndices, canvasWidth, canvasHeight) {
      this.qnum = qnum;
      this.title = title;
      this.desc = desc;
      this.boxCount = boxCount;
      this.options = options;
      this.optionIndices = optionIndices;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.selectedRect = -1;
      this.hoverTime = 0;
      this.timer = timerLength;
  
      this.THREEBOX = {
        LEFT: {
          XPOS: canvasWidth/10,
          YPOS: canvasHeight/2
        },
        MIDDLE: {
          XPOS: (canvasWidth/10)*4,
          YPOS: canvasHeight/2
        },
        RIGHT: {
          XPOS: (canvasWidth/10)*7,
          YPOS: canvasHeight/2
        }
      };
  
      // navigation buttons - forward, backward, pause, instructions
      var forward = document.createElementNS("http://www.w3.org/2000/svg",'bi-arrow-right-circle');
  
    }
  
    reset() {
      this.selectedRect =- 1;
      this.hoverTime = 0;
      this.timer = timerLength;
    }
    //writing any contents including title, timer and desc
    drawText(content, xpos, ypos) {
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(50);
      text(content, xpos, ypos);
    }
    
    drawQuestionBox(selected, content, xpos, ypos) {
        // Draw box
        if (selected) fill(255, 0, 0);
        else fill(0, 0, 200);
        rect(xpos, ypos, QBoxXSize, QBoxYSize);
    
        // Write text
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(content, xpos+QBoxXSize/2, ypos+QBoxYSize/2);
    }
    
    draw() {
      background(250, 250, 250);
      this.drawText(this.title, this.canvasWidth / 2, this.canvasHeight / 20);
      this.drawText(this.timer, this.canvasWidth / 2, this.canvasHeight - 100);
      this.drawText(this.desc, this.canvasWidth / 2, this.canvasHeight/4);
      
      // Draw answer rectangle (for question pages)
      if (this.boxCount == 3) {
        this.drawQuestionBox(this.selectedRect == this.optionIndices[0], this.options[0], this.THREEBOX.LEFT.XPOS, this.THREEBOX.LEFT.YPOS);
        this.drawQuestionBox(this.selectedRect == this.optionIndices[1], this.options[1], this.THREEBOX.MIDDLE.XPOS, this.THREEBOX.MIDDLE.YPOS);
        this.drawQuestionBox(this.selectedRect == this.optionIndices[2], this.options[2], this.THREEBOX.RIGHT.XPOS, this.THREEBOX.RIGHT.YPOS);  
      } else if (this.boxCount == 2) {
        this.drawQuestionBox(this.selectedRect == this.optionIndices[0], this.options[0], this.THREEBOX.LEFT.XPOS, this.THREEBOX.LEFT.YPOS);
        this.drawQuestionBox(this.selectedRect == this.optionIndices[1], this.options[1], this.THREEBOX.RIGHT.XPOS, this.THREEBOX.RIGHT.YPOS);  
      } else {
        this.drawQuestionBox(this.selectedRect == this.optionIndices[0], this.options[0], this.THREEBOX.MIDDLE.XPOS, this.THREEBOX.MIDDLE.YPOS);
      }
    }
  
    update() {
      // Update various counters
      if (frameCount % FRAMESECOND == 0) this.timer--;
      if (this.selectedRect >= 0) this.hoverTime++;
      else this.hoverTime = 0;
  
      // Based on counters, change page state.
      // 1. Move onto the next question
      if(this.hoverTime >= HOVERTHRESHOLD) return this.selectedRect;
  
      if (this.timer <= 0) return -2;
  
      return -1;
    }
  
    run() {
      this.draw();
      circle(mouseX, mouseY, 30);
      return this.update();
    }
  //maybe not needed when we using motion capturing. 
    isMouseWithin(mouseXPos, mouseYPos, boxXPos, boxYPos, boxWidth, boxHeight) {
      if (mouseXPos > boxXPos - 10 && 
          mouseXPos < boxXPos + boxWidth + 10 && 
          mouseYPos > boxYPos - 10 && 
          mouseYPos < boxYPos + boxHeight + 10) return true;
      return false;
    }
    
    // In Question Window, detect if mouse is seleting a box
    // later, mouseXPos, mouseYPos will be replaced with motion (left middle right), 
    //this.THREEBOX.xxxx.XPOS, this.THREEBOX.Lxxxx.YPOS, QBoxXSize, QBoxYSize will be replaced with THREEBOX.xxxx()
    mouseIsSelectingInQuestionWindow(mouseXPos, mouseYPos) {
      if (this.boxCount == 3) {
        if (this.isMouseWithin(mouseXPos, mouseYPos, this.THREEBOX.LEFT.XPOS, this.THREEBOX.LEFT.YPOS, QBoxXSize, QBoxYSize)) 
        this.selectedRect = this.optionIndices[0]; //0
        else if (this.isMouseWithin(mouseXPos, mouseYPos, this.THREEBOX.MIDDLE.XPOS, this.THREEBOX.MIDDLE.YPOS, QBoxXSize, QBoxYSize)) 
          this.selectedRect = this.optionIndices[1]; //1
        else if (this.isMouseWithin(mouseXPos, mouseYPos, this.THREEBOX.RIGHT.XPOS, this.THREEBOX.RIGHT.YPOS, QBoxXSize, QBoxYSize))
          this.selectedRect = this.optionIndices[2]; //12
        else this.selectedRect = -1; // not selecting
      } else if (this.boxCount == 2) {
        if (this.isMouseWithin(mouseXPos, mouseYPos, this.THREEBOX.LEFT.XPOS, this.THREEBOX.LEFT.YPOS, QBoxXSize, QBoxYSize)) 
        this.selectedRect = this.optionIndices[0];
        else if (this.isMouseWithin(mouseXPos, mouseYPos, this.THREEBOX.RIGHT.XPOS, this.THREEBOX.RIGHT.YPOS, QBoxXSize, QBoxYSize))
          this.selectedRect = this.optionIndices[1];
        else this.selectedRect = -1;
      } else if (this.boxCount == 1) {
        if (this.isMouseWithin(mouseXPos, mouseYPos, this.THREEBOX.MIDDLE.XPOS, this.THREEBOX.MIDDLE.YPOS, QBoxXSize, QBoxYSize)) 
          this.selectedRect = this.optionIndices[0];
        else this.selectedRect = -1;
      }
    }
  }
  
  function preload(){
    qrcode =loadImage("static/spotifyplaylist.png")
  }
  
  function setup() {
    createCanvas(windowWidth, windowHeight);
  
    QuestionPages = [];
    for (let i = 0; i < 5; i++) {
      QuestionPages[i] = new SelectPage(i + 1, "Question" + (i + 1), questionText[i], 
      3, [option1[i], option2[i], option3[i]], [0, 1, 2],
      windowWidth, windowHeight);
    }
  
    PausePage = new SelectPage(-2, "PAUSED", "Would you like to continue?", 2, ["Continue", "Quit"], [3, 4], windowWidth, windowHeight);
    FinalPage = new ResultPage(windowWidth, windowHeight, qrcode);
  
    currentPage = QuestionPages[questionCount];
  }
  
  function draw(){
    let status = currentPage.run();
    // If status == -1, then keep drawing the page.
    if (status >= 0 && status <= 2) {
      answers[questionCount] = status;
      questionCount++;
  
      if (questionCount == 5) {
        $.ajax({
          url: "/results?selection=" + answers,
          type: "GET",
          success: function (data) {
            FinalPage.populate(data);
          },
          error: function (error) {
            FinalPage.populate(["Encountered an error when", "connecting to the server."])
          }
        });
        currentPage = FinalPage;
      } else {
        // Otherwise, move to the next page
        currentPage = QuestionPages[questionCount]
      }
    } else if (status == -2) {
      PausePage.reset();
      currentPage = PausePage;
    } else if (status == 3) {
      currentPage = QuestionPages[questionCount];
      currentPage.reset();
    } else if (status == 4 || status == -3) {
      window.location.href = "/"
    }
  
  }
  
  function mouseMoved() {
    x
    if (currentPage != null) currentPage.mouseIsSelectingInQuestionWindow(mouseX, mouseY);
  }
  
  