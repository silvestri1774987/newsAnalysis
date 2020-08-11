import pandas as pd

def action():
    dataset="static/dataset.csv"

    data = pd.io.parsers.read_csv(dataset,
         delimiter=',',
         header=0,
        );


    frequency_of=["argument", "day","numWords","numMedia"]
    
    for elem in frequency_of:
        table=pd.crosstab(index=data[elem], columns=data["successful"])
        table.columns=["0", "1"]
        table.to_csv("static/"+elem+"_instances.csv")
    return 0;

if __name__ == "__main__":
    action()
