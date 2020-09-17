import pandas as pd

def action():
    dataset="static/dataset.csv"

    data = pd.io.parsers.read_csv(dataset,
         delimiter=',',
         header=0,
        );

    frequency_of=["argument", "day","numWords","numMedia"]



    for elem in frequency_of:#group by with the value of argument/day/ecc... for the rows and succesfull for the columns(0 and 1), with normalize=index we normlaize for each row
        table=pd.crosstab(index=data[elem], columns=data["successful"], normalize="index")
        table.columns=["1", "0"]
        #swap 2 and 1
        table=table.rename(index=str, columns={"0": "2"})
        table=table.rename(index=str, columns={"1": "0"})
        table=table.rename(index=str, columns={"2": "1"})
        table.to_csv("static/"+elem+"_frequency.csv")
    return 0;

if __name__ == "__main__":
    action()
