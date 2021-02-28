var over=false;//游戏是否结束
var me=true;//定义黑白棋
var chessboard=[];//定义棋子落点
var win=[];//赢法数组
var mywins=[];//人赢法数目
var aiwins=[];//ai赢法数目
var count=0;//赢法数量

//二维数组
for(var i=0;i<15;i++){
    chessboard[i]=[];
    for(var j=0;j<15;j++){
        chessboard[i][j]=0;
    }
}

//赢法数组
for(var i=0;i<15;i++){
    win[i]=[];
    for(var j=0;j<15;j++){
        win[i][j]=[];
    }
}

//赢法统计
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            win[i][j+k][count]=true;
        }
        count++;
    }
}
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            win[j+k][i][count]=true;
        }
        count++;
    }
}
for(var i=0; i<11; i++){
    for(var j=0; j<11; j++){
        for(var k=0; k<5; k++){
            win[i+k][j+k][count] = true;
        }
        count++ ;
    }
}
for(var i=0; i<11; i++){
    for(var j=14; j>3; j--){
        for(var k=0; k<5; k++){
            win[i+k][j-k][count] = true;
        }
        count++ ;
    }
}
console.log(count);

//赢法数目
for(var i=0;i<count;i++){
    mywins[i]=0;
    aiwins[i]=0;
}

//
var chess=document.getElementById("canvas");
var context=chess.getContext('2d');
context.strokeStyle = "#aaa";


//棋盘
function drawLine(){
    for (var i=0; i<15; i++) {
        context.moveTo(15,15+i*30);
        context.lineTo(435,15+i*30);
        context.stroke();
        context.moveTo(15+i*30,15);
        context.lineTo(15+i*30,435);
        context.stroke();
    }
}
drawLine();//画棋盘
//棋子
var oneStep = function (i,j,me){
    context.beginPath();
	context.arc(15+i*30, 15+j*30, 13, 0, 2*Math.PI);
	context.closePath();
    var gradient = context.createRadialGradient(15+i*30+2, 15+j*30-2, 13, 15+i*30+2, 15+j*30-2, 0);
    if(me){
        gradient.addColorStop(0,"#0A0A0A");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    context.fillStyle=gradient;
    context.fill();
}
//鼠标点击落子,,人下棋
chess.onclick = function(e){
    if(over){
        return;
    }
    if(!me){
        return;
    }
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30); //Math.floor向下取整
	var j = Math.floor(y / 30);
	if(chessboard[i][j] == 0){
        oneStep(i,j,me);
        chessboard[i][j]=1;
        for(var k=0;k<count;k++){
            if(win[i][j][k]){
                mywins[k]++;
                aiwins[k]=6;       //6不能赢
                if(mywins[k]==5){   //达到5赢
                    document.getElementById('ifwin').innerHTML="恭喜你赢了";
                    over=true;
                }
            }
        }
        if(!over){
            me= !me;
            computerAI();
        }
    }
}
//AI落子
var computerAI = function(){
    var myvalue=[];
    var AIvalue=[];
    var max = 0;
	var u = 0, v = 0;
    for(var i=0;i<15;i++){
        myvalue[i]=[];
        AIvalue[i]=[];
        for(var j=0;j<15;j++){
            myvalue[i][j]=0;
            AIvalue[i][j]=0;
        }
    }
    for(var i=0; i<15; i++){
        for(var j=0; j<15; j++){
            if(chessboard[i][j]==0){
                for(var k=0; k<count; k++){
                    if(win[i][j][k]){
                        if(mywins[k] == 1){
                            myvalue[i][j] += 200;
                        }else if(mywins[k] == 2){
                            myvalue[i][j] += 400;
                        }else if(mywins[k] == 3){
                            myvalue[i][j] += 2000;
                        }else if(mywins[k] == 4){
                            myvalue[i][j] += 10000;
                        }
                        if(aiwins[k] == 1){
                            AIvalue[i][j] += 220;
                        }else if(aiwins[k] == 2){
                            AIvalue[i][j] += 420;
                        }else if(aiwins[k] == 3){
                            AIvalue[i][j] += 2200;
                        }else if(aiwins[k] == 4){
                            AIvalue[i][j] += 20000;
                        }
                    }
                }
                if(myvalue[i][j] > max ){
                    max = myvalue[i][j];
                    u = i;
                    v = j;
                }else if(myvalue[i][j] == max){
                    if(AIvalue[i][j] > AIvalue[u][v]){
                        u = i;
                        v = j;
                    }
                }
                if(AIvalue[i][j] > max){
                    max = AIvalue[i][j];
                    u = i;
                    v = j;
                }else if(AIvalue[i][j] == max){
                    if(myvalue[i][j] > myvalue[u][v]){
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    oneStep(u, v, false);
    chessboard[u][v] = 2; 

    for(var k=0; k<count; k++){
        if(win[u][v][k]){
            aiwins[k]++;
            mywins[k] = 6;
            if(aiwins[k] == 5){
                document.getElementById('ifwin').innerHTML="计算机胜利";
                over=true;
            }
        }
    }
    if(!over){
        me= !me ;
    }
}