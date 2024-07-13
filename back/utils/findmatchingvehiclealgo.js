function calculateVolume(item){
    return item.height * item.depth * item.width;
    }

const allPermutationsOfItem = (item)=> {
    return [
        {height: item.height, width: item.width, depth: item.depth},
        {height: item.height, width: item.depth, depth: item.width},
        {height: item.width, width: item.height, depth: item.depth},
        {height: item.width, width: item.depth, depth: item.height},
        {height: item.depth, width: item.height, depth: item.width},
        {height: item.depth, width: item.width, depth: item.height}
    ]
}

export const isThereMatchBetweenMoveRequestToVehicle = (itemsArr, vehicleHeight,vehicleWidth,vehicleDepth ) =>{
    itemsArr.sort((a,b)=> {
        return calculateVolume(b) - calculateVolume(a);
     });
    let itemsArrLength = itemsArr.length;
    let freeSpace =  { 
        height: vehicleHeight,
        width: vehicleWidth,
        depth: vehicleDepth
    }
   for(let i =0; i< itemsArrLength ;i++)
    {
       let isItemFits = false;
       let permutations = allPermutationsOfItem(itemsArr[i]);
       let permutationsLength = permutations.length;
       for(let j =0 ; j< permutationsLength; j++)
        {
            let permutation = permutations[j];
           if(permutation.height <= freeSpace.height && permutation.width <= freeSpace.width && permutation.depth <= freeSpace.depth)
            {
                freeSpace.height -= permutation.height;
                freeSpace.width -= permutation.width;
                freeSpace.depth -= permutation.depth;
                isItemFits = true;
                break;
            }
        }
        if(!isItemFits)
            return false;
    }
    return true;
   
}

