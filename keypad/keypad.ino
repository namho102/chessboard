int row[]={2,3,4,5};// Defining row pins of keypad connected to Aeduino pins
int col[]={8,9,10,11};//Defining column pins of keypad connected to Arduino
int i,j; // Two counter variables to count inside for loop
int col_scan; // Variable to hold value of scanned columns

int keymap[4][4] = 
{
  {0, 0, 0, 0}, 
  {0, 0, 0, 0}, 
  {0, 0, 0, 0}, 
  {0, 0, 0, 0}, 
};
int zeromap[4][4] =  
{
  {0, 0, 0, 0}, 
  {0, 0, 0, 0}, 
  {0, 0, 0, 0}, 
  {0, 0, 0, 0}, 
};


void setup()
{
  Serial.begin(9600);
  for(i=0;i<=3;i++)
  {
    pinMode(row[i],OUTPUT);
    pinMode(col[i],INPUT);
    digitalWrite(col[i], HIGH);
  }
}
void loop()

{  
  for(i=0; i<=3; i++)
    for(j=0; j<=3; j++)
      keymap[i][j] = 0;
      
//  Serial.println("/////////////////");
  for(i=0; i<=3; i++) { 
    digitalWrite(row[0], HIGH);
    digitalWrite(row[1], HIGH);
    digitalWrite(row[2], HIGH);
    digitalWrite(row[3], HIGH);
//
//     digitalWrite(row[0], LOW);
//    digitalWrite(row[1], LOW);
//    digitalWrite(row[2], LOW);
//    digitalWrite(row[3], LOW);
//    
    digitalWrite(row[i], LOW);
    for(j=0; j<=3; j++)
    {
    col_scan = digitalRead(col[j]);

    if(col_scan == LOW) {
      keymap[i][j] = 1;
    //        keypress(i,j);
    //          Serial.print("1 ");
    //        delay(300);
      }
    //        else Serial.print("0 ");
      
    }

      
      
//    
    }

  
  for(i = 0; i <= 3; i++) {
      for(j = 0; j <= 3; j++) {
        if( i == 3 && j == 3)
          Serial.println(keymap[i][j]);
        else
          Serial.print(keymap[i][j]);
      }
//      Serial.println("");    
    }
//     Serial.println("");
    delay(1000);
  
  
}
void keypress(int i, int j)
{
  if(i==0&&j==0)
    Serial.println("1");
  if(i==0&&j==1)
    Serial.println("2");
  if(i==0&&j==2)
    Serial.println("3");
  if(i==0&&j==3)
    Serial.println("A");
  if(i==1&&j==0)
    Serial.println("4");
  if(i==1&&j==1)
    Serial.println("5");
  if(i==1&&j==2)
    Serial.println("6");
  if(i==1&&j==3)
    Serial.println("B");
  if(i==2&&j==0)
    Serial.println("7");
  if(i==2&&j==1)
    Serial.println("8");
  if(i==2&&j==2)
    Serial.println("9");
  if(i==2&&j==3)
    Serial.println("C");
  if(i==3&&j==0)
    Serial.println("*");
  if(i==3&&j==1)
    Serial.println("0");
  if(i==3&&j==2)
    Serial.println("#");
  if(i==3&&j==3)
    Serial.println("D");
}
