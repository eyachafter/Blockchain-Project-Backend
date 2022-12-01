// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract BackendContract {

    event CreateTweet(address recipient, uint uniqueID);
    
    event DeleteTweet(uint uniqueID, bool isRemoved);

    struct Tweet {
        uint id;
        address walletID;
        string tweetText;
        bool isRemoved;
    }

    Tweet[] private tweets;

    mapping(uint256 => address) tweetToOwner;

    function createTweet(string memory tweetText, bool isRemoved) external {
        uint uniqueID = tweets.length;
        tweets.push(Tweet(uniqueID, msg.sender, tweetText, isRemoved));
        tweetToOwner[uniqueID] = msg.sender;
        emit CreateTweet(msg.sender, uniqueID);
    }

    function getAllTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;
        for(uint i=0; i<tweets.length; i++) {
            if(tweets[i].isRemoved == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function getMyTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;
        for(uint i=0; i<tweets.length; i++) {
            if(tweetToOwner[i] == msg.sender && tweets[i].isRemoved == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function deleteTweet(uint uniqueID, bool isRemoved) external {
        if(tweetToOwner[uniqueID] == msg.sender) {

            tweets[uniqueID].isRemoved = isRemoved;

            emit DeleteTweet(uniqueID, isRemoved);
        }
    }

}
