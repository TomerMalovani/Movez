CREATE DATABASE movez;

CREATE TABLE Users (
UserID SERIAL PRIMARY KEY,
Username VARCHAR(50) NOT NULL,
Email VARCHAR(100) UNIQUE NOT NULL,
Password VARCHAR(200) NOT NULL,
);

CREATE TABLE MoveRequestItems (
RequestItemID SERIAL PRIMARY KEY,
UserID INT,
ItemDescription TEXT NOT NULL,
Height float NOT NULL,
Width float NOT NULL,
Depth float NOT NULL,
Weight float NOT NULL,
Quantity INT NOT NULL,
SpecialInstructions TEXT,
FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

--each move request will have a list of items

CREATE TABLE MoveRequest (
RequestID SERIAL PRIMARY KEY,
UserID INT,
Status VARCHAR NOT NULL, DEFAULT "In Progress"
RequestItemID INTEGER[], --array of RequestItemID
MovingDate DATE NOT NULL,
MovingTime TIME NOT NULL,
MovingFrom VARCHAR(100) NOT NULL,
MovingTo VARCHAR(100) NOT NULL,
FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE PriceProposals (
ProposalID SERIAL PRIMARY KEY,
RequestID INT,
MoverID INT,
EstimatedCost DECIMAL(10, 2) NOT NULL,
Status VARCHAR(10) DEFAULT 'Pending',
FOREIGN KEY (RequestID) REFERENCES MovingRequests(RequestID),
FOREIGN KEY (MoverID) REFERENCES Users(UserID)
);

CREATE TABLE VehicleInfo (
MoverID INT,
VehicleID SERIAL PRIMARY KEY,
VehicleType VARCHAR(50) NOT NULL,
Depth DECIMAL(10, 2) NOT NULL,
Width DECIMAL(10, 2) NOT NULL,
Height DECIMAL(10, 2) NOT NULL,
FOREIGN KEY (MoverID) REFERENCES Users(UserID)
);