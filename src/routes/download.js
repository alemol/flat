const express = require('express');
const router = express.Router();
const pool = require("../databaseInterviews");
const fs = require('fs');

router.get('/allJSON', async (req, res) => {
    var ids = await pool.query('select distinct idInterview from dialogInterviews');
    //para cada id es ineficiente
    for (let i = 0; i < 1; i++) {
        const id = ids[i].idInterview;
        console.log("the id: " + id);
        var unArmedInterview = {
            text: [],
            tags: []
        };
        unArmedInterview.text = await pool.query('select d.typePerson,stamp,content from dialogInterviews as d left join CatTypePerson as cp on d.typePerson=cp.typePerson where idInterview =?', [id]);
        unArmedInterview.tags = await pool.query('select id_cat_tag,stamp,sentence from tagged_process where idDialogInterview =? order by stamp', [id])
        if (unArmedInterview.tags.length > 0) {
            var modifiedSentences = unArmedInterview.tags.map(e => { return { stamp: e.stamp, sentence: `<tag ${e.id_cat_tag}> ${e.sentence} </tag>` } })
            for (let index = 0; index < modifiedSentences.length; index++) {
                const sentence = modifiedSentences[index];
                var IofEl;
                for (let iot = 0; iot < unArmedInterview.text.length; iot++) {
                    const eiot = unArmedInterview.text[iot];
                    if (eiot.stamp == sentence.stamp) {
                        IofEl = iot;
                        break;
                    }
                }
                var oldSentence = unArmedInterview.text[IofEl].content.toString() + "";
                var newSentence = oldSentence.replace(unArmedInterview.tags[index].sentence, sentence.sentence);
                unArmedInterview.text[IofEl].content = newSentence;
            }
        }
    }
    delete unArmedInterview.tags;
    try {
        await fs.unlinkSync('./interview.json', (err) => {
            if (err) {
                console.log("file do not exist for elimination");
            }
        });
    } catch (err) {
        
    }
    var outputJson = await JSON.stringify(unArmedInterview);
    await fs.appendFileSync('Interview.json', outputJson, 'utf8', (error) => {
        if (error) {
            throw error;
        }
    });

    res.download('./interview.json');
});

router.get('/TagsFromInterview/:id', async (req, res) => {
    const { id } = req.params;
    await crateDocument(`tagsfrominterview${id}`, 'select * from tagged_process where idDialogInterview=?', id)
    res.download(`./tagsfrominterview${id}.json`);
});
router.get('/Interview/:id', async (req, res) => {
    const { id } = req.params;
    await crateDocument(`interview${id}Clean`, 'select content from Interviews where idInterview = ?', id);
    res.download(`./interview${id}Clean.json`);
});
router.get('/Fcategory/:id', async (req, res) => {
    const { id } = req.params;
    await crateDocument(`tags${id}`, 'select * from tagged_process where id_cat_tag=?', id)
    res.download(`./tags${id}.json`);
});
router.get('/Filtered/:id', async (req, res) => {
    const params = " ";
    console.log("params ", params);
    res.send('para descargar filtrados');
});
router.get('/allTags', async (req, res) => {
    const tags = pool.query('select * from tagged_process');
    try {
        await fs.unlinkSync('./allTags.json', (err) => {
            if (err) {
                console.log("file do not exist for elimination");
            }
        });
    } catch (err) {
        /*  */
    }
    var outputJson = await JSON.stringify(tags);
    await fs.appendFileSync('allTags.json', outputJson, 'utf8', (error) => {
        if (error) {
            throw error;
        }
    });
    res.download(`./allTags.json`);
});
async function crateDocument(name, query, id) {
    const qry = await pool.query(query, [id]);
    try {
        fs.unlinkSync(`./${name}.json`, (err) => {
            if (err) {
                console.log("file do not exist for elimination");
            }
        });
        console.log('deleted ' + name);
    } catch{ }

    fs.appendFileSync(`${name}.json`, JSON.stringify(qry), 'utf8', (error) => {
        if (error) {
            throw error;
        }
    });
    console.log('added ' + name);

}



module.exports = router;