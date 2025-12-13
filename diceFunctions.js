function rollDice() {
    let dice = Number(document.getElementById("diceInput").value);
    let sides = Number(document.getElementById("sidesInput").value);
    let goal = document.getElementById("goalInput").value;
    let noGoal = false;
    if (goal == "") { noGoal = true; }
    goal = Number(goal);
    let modes = ["compLT","compLE","compET","compGE","compGT"];
    let mode = "&ge;";
    for (let i=0; i<5; i++) {
        if (document.getElementById(modes[i]).checked) { 
            mode = document.getElementById(modes[i]).value;
        }
    }
    if (dice < 1 || sides < 1) {
        document.getElementById("output2").innerHTML = "";
        return true;
    }
    const result = [];
    let sum = 0;
    let output = "";
    for (let i = 0; i < dice; i++) {
        let roll = Math.ceil(Math.random()*sides)
        result[i] = roll;
        sum += roll;
        output += roll+"  "
    }
    output += "; sum = "+sum
    document.getElementById("output2").innerHTML = output;
    if (goalCompare(sum, goal, mode)) { document.getElementById("output2").style = "text-align: center; font-size: 28px; color:Green"; }
    if (!goalCompare(sum, goal, mode)) { document.getElementById("output2").style = "text-align: center; font-size: 28px; color:Red"; }
    if (noGoal) { document.getElementById("output2").style = "text-align: center; font-size: 28px; color:Blue"; }
    return true;
}

function calculateProbability() {
    let dice = Number(document.getElementById("diceInput").value);
    let sides = Number(document.getElementById("sidesInput").value);
    let goal = document.getElementById("goalInput").value;
    let noGoal = false;
    if (goal == "") { noGoal = true; }
    goal = Number(goal);
    let modes = ["compLT","compLE","compET","compGE","compGT"];
    let mode = '3';
    for (let i=0; i<5; i++) {
        if (document.getElementById(modes[i]).checked) { 
            mode = document.getElementById(modes[i]).value;
        }
    }
    if (dice < 1 || sides < 1 || noGoal) {
        document.getElementById("output1").innerHTML = "";
        return true;
    }
    else {
        let prob = weightedCombinations(dice,sides,goal,mode);
        let compareText = "";
        switch (mode) {
            case '0':
                compareText = "less than "+goal;
                break;
            case '1':
                compareText = goal+" or less";
                break;
            case '2':
                compareText = "exactly "+goal;
                break;
            case '3':
                compareText = goal+" or more";
                break;
            case '4':
                compareText = "more than "+goal;
                break;
        }
        let output = "The probability of getting "+compareText+" from rolling "+dice+" d"+sides+" is "+prob.toFixed(2)+"%."
        if (prob == -1) { output = "Too big to calculate."; }
        document.getElementById("output1").innerHTML = output;
    }
    return true;
}

function weightedCombinations(d,s,g,m) {
    if (g < d) {
        if (m == '0' || m == '1' || m == '2') { return 0; }
        if (m == '3' || m == '4') { return 100; }
    }
    if (g == d) {
        if (m == '0') { return 0; }
        if (m == '3') { return 100; }
    }
    if (g == d*s) {
        if (m == '1') { return 100; }
        if (m == '4') { return 0; }
    }
    if (g > d*s) {
        if (m == '0' || m == '1') { return 100; }
        if (m == '2' || m == '3' || m == '4') { return 0; }
    }
    let temp = [];
    for (let i=0; i<s; i++){
        temp[i] = i+1;
    }
    for (let i=0; i<d-1; i++){
        temp = consecSums(temp);
    }
    let combCount = temp[s-1];
    let count = Math.pow(s,d);
    if (count >= 9007199254740992) { return -1; }
    let goals = 0;
    let rep = [];
    for (let i=0; i<d; i++) {
        rep[i] = 1;
    }
    for (let i=0; i<combCount; i++) {
        if (goalCompare(sumList(rep,d), g, m)) {
            goals += permutationCount(rep,d);
        }
        rep = repAdd(s,rep,d);
    }
    let prob = goals/count;
    let probPercent = prob*100;
    return probPercent;
}

function repAdd(base,rep,len) {
    let toFill = [];
    let filler = -1;
    for (let i=0; i<len; i++) {
        if (rep[i] != base) {
            rep[i] += 1;
            filler = rep[i];
            break;
        }
        else {
            toFill.push(i);
        }
    }
    for (let i=0; i<toFill.length; i++) {
        rep[i] = filler;
    }
    return rep;
}

function permutationCount(list,len) {
    let repeatFactor = 1;
    let repeats = 1;
    for (let i=0; i<len-1; i++) {
        if (list[i+1] == list[i]) {
            repeats += 1;
        }
        else {
            repeatFactor *= factorial(repeats);
            repeats = 1;
        }
    }
    repeatFactor *= factorial(repeats);
    let count = factorial(len)/repeatFactor;
    return count;
}

function factorial(x) {
    if (x>1) { return x*factorial(x-1); }
    else { return 1; }
}

function consecSums(list) {
    let newList = [];
    for (let i=0; i<list.length; i++) {
        newList.push(sumList(list,i+1));
    }
    return newList;
}

function sumList(list,end) {
    let sum = 0;
    for (let i=0; i<end; i++) {
        sum += list[i];
    }
    return sum
}

function goalCompare(item, goal, mode) {
    let ret = false;
    switch (mode) {
        case '0':
            ret = (item < goal);
            break;
        case '1':
            ret = (item <= goal);
            break;
        case '2':
            ret = (item == goal);
            break;
        case '3':
            ret = (item >= goal);
            break;
        case '4':
            ret = (item > goal);
            break;
    }
    return ret;
}