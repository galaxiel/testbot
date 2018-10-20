module.exports = () => {
  return async function(msg, Database, triviaSend) {
    var json;
    var json2;

    global.client.shard.send({stats: { commandCategoriesCount: 1 }});

    try {
      json = await Database.getCategories();
      json2 = await Database.getGlobalCounts();
    } catch(err) {
      // List was queried successfully, but the question was not received.
      triviaSend(msg.channel, msg.author, {embed: {
        color: 14164000,
        description: `Failed to query category counts.\n${err}`
      }});
      console.log(`Failed to retrieve category counts for 'trivia categories'.\n${err}`);
      return;
    }

    var categoryListStr = "**Categories:** ";
    var i = 0;
    //console.log(json2);
    for(i in json) {
      categoryListStr = `${categoryListStr}\n${json[i].name} - ${json2.categories[json[i].id].total_num_of_verified_questions} questions`;
    }

    var str = "A list has been sent to you via DM.";
    if(msg.channel.type === "dm") {
      str = "";
    }

    triviaSend(msg.author, void 0, categoryListStr, (msg2, err) => {
      if(err) {
        str = "Unable to send you the list because you cannot receive DMs.";
      }
      else {
        i++;
        triviaSend(msg.channel, void 0, `There ${i===1?"is":"are"} ${i} categor${i===1?"y":"ies"}. ${str}`);
      }
    });
  };
};
