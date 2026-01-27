function rolldice()
{
    const numofdice = document.getElementById("numofdice").value;
const diceresult = document.getElementById("diceresult");
  const diceimg = document.getElementById("diceimg");
const values = [];
const images= [];
 
for(let i= 0;i<numofdice;i++)
{
    const value =Math.floor(Math.random()*6 )+1;
values.push(value);
images.push(`<img src ="dice_images/${value}.png" alt ="dice ${value}">`);

}
diceresult.textContent = `dice:${values.join(', ')}`;
diceimages.innerHTML = images.join('');
}