//int row[] = {10, 11, 12, 13, 14, 15, 16, 17};
int row[] = {8, 9, 10, 11, 12, 13, 14, 15};
//int col[] = {2, 3, 4, 5, 6, 7, 8, 9}; // HIGH
int col[] = {0, 1, 2, 3, 4, 5, 6, 7}; // HIGH
int i, j; // Two counter variables to count inside for loop
int col_scan; // Variable to hold value of scanned columns

int keymap[8][8] =
{
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0}
};



void setup()
{
  Serial.begin(9600);
  
  for (i = 0; i <= 7; i++)
  {
    pinMode(row[i], OUTPUT);
    pinMode(col[i], INPUT);
    digitalWrite(col[i], HIGH);
  }
  
}
void loop()

{
  //reset matrix
  for (i = 0; i <= 7; i++)
    for (j = 0; j <= 7; j++)
      keymap[i][j] = 0;

  for (i = 0; i <= 7; i++) {

    for (j = 0; j <= 7; j++)  {
      digitalWrite(row[j], HIGH);
    }


    digitalWrite(row[i], LOW);

    for (j = 0; j <= 7; j++)
    {
      col_scan = digitalRead(col[j]);

      if (col_scan == LOW) {
        keymap[i][j] = 1;
        //        keypress(i,j);
        //          Serial.print("1 ");
        //        delay(300);
      }
      //        else Serial.print("0 ");

    }


  }


  for (i = 0; i <= 7; i++) {
    for (j = 0; j <= 7; j++) {
      if ( i == 7 && j == 7)
        Serial.println(keymap[i][j]);
      else
        Serial.print(keymap[i][j]);
    }
  }

  delay(500);


}

