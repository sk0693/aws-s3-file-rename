const httpStatus = require('http-status');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const copyDeletePromise = async (bucket, key, replaced_text) => {
  try {
    let cp_obj = {
      Bucket: bucket,
      CopySource: `${bucket}/${key}`,
      Key: replaced_text
    }
    await s3.copyObject(cp_obj).promise();

    await s3.deleteObject({
      Bucket: bucket,
      Key: key
    }).promise()
    return key;

  } catch (error) {
    throw error;
  }
}

const getSearchedFiles = async (req, res) => {
  try {

    let { folder_path = '', search_text = '', replacement_text = '' } = req.body;

    if (!folder_path || !search_text || !replacement_text) {
      throw "folder_path or search_text or replacement_text not found!!!"
    }

    const params = {
      Bucket: 'nowfloat-images',
      Delimiter: '/',
      Prefix: folder_path || '/',
    }

    let parsable_obj = {
      arr: [],
      search_text,
      replacement_text,
      promises: []
    }

    await listAllKeys(params, parsable_obj);

    if (parsable_obj['promises'].length) {
      await Promise.all(parsable_obj['promises']);
    }

    delete parsable_obj['promises'];

    return res.send(parsable_obj);

  } catch (error) {
    console.error(error);
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

const listAllKeys = async (params, parsable_obj) => {
  try {
    let data = await s3.listObjectsV2(params).promise();

    let contents = data.Contents;

    for (const content of contents) {
      let key = content.Key;
      // will remove prefix value in key to remove duplicacy later
      let search_position = key.indexOf(parsable_obj['search_text']);
      if (search_position > -1) {
        
        let replaced_text = key.replace(parsable_obj['search_text'], parsable_obj['replacement_text']);
        
        parsable_obj['arr'].push({
          search_position,
          old_key: key,
          new_key: replaced_text,
          bucket: params.Bucket,
          prefix: params.Prefix
        });


        parsable_obj['promises'].push(copyDeletePromise(params.Bucket, key, replaced_text));
      }
    }


    if (data.IsTruncated) {
      params.ContinuationToken = data.NextContinuationToken;
      console.log("get further list...");
      await listAllKeys(params, parsable_obj);
    }
  } catch (error) {
    console.error(error); // an error occurred
    throw error;
  }
}

module.exports = {
  getSearchedFiles
};
