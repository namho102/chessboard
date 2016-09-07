int row[]= {14, 15, 16, 17};
int col[]= {2, 3, 4, 5};// HIGH
int i, j; // Two counter variables to count inside for loop
int col_scan; // Variable to hold value of scanned columns

int keymap[4][4] = 
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
      
  for(i=0; i<=3; i++) { 
    digitalWrite(row[0], HIGH);
    digitalWrite(row[1], HIGH);
    digitalWrite(row[2], HIGH);
    digitalWrite(row[3], HIGH);
  
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

 
    }

  
  for(i = 0; i <= 3; i++) {
      for(j = 0; j <= 3; j++) {
        if( i == 3 && j == 3)
          Serial.println(keymap[i][j]);
        else
          Serial.print(keymap[i][j]);
      }
    }

    delay(1000);
  
  
}

