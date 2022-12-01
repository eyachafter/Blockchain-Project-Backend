const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("TwitterContract", function() {
  let Twitter;
  let twitter;
  let owner;
  let _totalTweets;
  let _totalUserTweets;


  const TOTAL_TWEETS = 19;
  const TOTAL_ofUSER = 6;

  beforeEach(async function() {
    Twitter = await ethers.getContractFactory("TwContract");
    [owner, addr1, addr2] = await ethers.getSigners();

    twitter = await Twitter.deploy();

    _totalTweets = [];
    _totalUserTweets = [];

    for(let i = 0; i < TOTAL_TWEETS; i++) {
      let tweet = {
        'newText': 'text with id:- ' + i,
        'username': addr1,
        'isDeleted': false
      };

      await twitter.connect(addr1)._writeTweet(tweet.newText, tweet.isDeleted);
      _totalTweets.push(tweet);
    }

    for(let i = 0 ; i < TOTAL_ofUSER; i++) {
      let tweet = {
        'username': owner,
        'newText': 'text with id:- ' + (TOTAL_TWEETS+i),
        'isDeleted': false
      };

      await twitter._writeTweet(tweet.newText, tweet.isDeleted);
      _totalTweets.push(tweet);
      _totalUserTweets.push(tweet);
    }
  });

  describe("Add Tweet", function() {
    it("should emit AddTweet event", async function() {
      let tweet = {
        'newText': 'New Tweet',
        'isDeleted': false
      };

      await expect(await twitter._AddTweet(tweet.newText, tweet.isDeleted)
    ).to.emit(twitter, 'AddTweet').withArgs(owner.address, TOTAL_TWEETS + TOTAL_ofUSER);
    })
  });

  describe("Fetch All Tweets", function() {
    it("should return the total number of tweets", async function() {
      const tweetsFromChain = await twitter._fetchAllTweets();
      expect(tweetsFromChain.length).to.equal(TOTAL_TWEETS+TOTAL_ofUSER);
    })

    it("should return the total number of specific user's tweets", async function() {
      const myTweetsFromChain = await twitter._fetchUserTweets();
      expect(myTweetsFromChain.length).to.equal(TOTAL_ofUSER);
    })
  })

  describe('Update Tweet', function() {
    it('should emit UpdateTweet event', async function() {
      const TWEET_ID = 13;
      const TWEET_NEW_TEXT = 'Edit Tweet text';
      const ISDELETED = false;

      await expect(
        twitter._updateTweet(TWEET_ID, TWEET_NEW_TEXT, ISDELETED)
      ).to.emit(
        twitter, 'UpdateTweet'
        ).withArgs(
          owner.address, TWEET_ID, ISDELETED);
    });
  })

  describe("Delete Tweet", function() {
    it("should emit delete tweet event", async function() {
      const TWEET_ID = 0;
      const TWEET_DELETED = true;

      await expect(
        twitter.connect(addr1)._deleteTweet(TWEET_ID, TWEET_DELETED)
      ).to.emit(
        twitter, 'DeleteTweet'
      ).withArgs(
        TWEET_ID, TWEET_DELETED
      );
    })
  })
});