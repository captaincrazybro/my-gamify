const { firestore } = require('./firebase');
const roomsRef = firestore.collection('rooms');

const serviceFunctions = (() => {
    
    const getRooms = () => {
        return roomsRef.get(); 
    }

    const getRoomFromCode = async (code) => {
        const docs = roomsRef.get();
        const docsResponse = await docs.then().catch((err) => {
            console.log("Error getting doc", err);
        });

        let tempArr = [];

        docsResponse.forEach((doc) => {
            tempArr.push({id: doc.id, data: doc.data()});
        });

        for (let i = 0; i<tempArr.length; i++) {
            if (tempArr[i].id == code) {
                console.log(tempArr[i])
                return tempArr[i];
            }
        }

        return null;
    }
    
    const getRoomFromName = async (name) => {
        const docs = roomsRef.get();
        const docsResponse = await docs.then().catch((err) => {
            console.log("Error getting doc", err);
        });

        let tempArr = [];

        docsResponse.forEach((doc) => {
            tempArr.push({id: doc.id, data: doc.data()});
        });

        for (let i = 0; i<tempArr.length; i++) {
            if (tempArr[i].data.name == name) {
                return tempArr[i];
            }
        }
    }

    const getQuestionsFromCode = async (code) => {
        let questionsRef = roomsRef.doc(code).collection('questions');
        const docs = questionsRef.get();

        const docsResponse = await docs.then().catch((err) => {
            console.log("Error getting doc", err);
        });

        let tempArr = [];

        docsResponse.forEach((doc) => {
            tempArr.push({id: doc.id, data: doc.data()});
        });

        return tempArr;
    }

    const getUsersFromCode = async (code) => {
        let usersRef = roomsRef.doc(code).collection('users');
        const docs = usersRef.get();

        const docsResponse = await docs.then().catch((err) => {
            console.log("Error getting doc", err);
        });

        let tempArr = [];

        docsResponse.forEach((doc) => {
            tempArr.push({id: doc.id, data: doc.data()});
        });

        return tempArr;
    }

    const setRoom = (code, name, state, ownerId, questionNumber) => {
        roomsRef.doc(code).set({
            name: name,
            state: state,
            ownerId: ownerId, 
            questionNumber: questionNumber
        });
    }

    const setState = async (code, state) => {
        await roomsRef.doc(code).update({
            state: state
        })
    }

    const setOwnerId = async (code, ownerId) => {
        await roomsRef.doc(code).update({
            ownerId: ownerId
        })
    }

    const setQuestionNumber = async (code, questionNumber) => {
        await roomsRef.doc(code).update({
            questionNumber: questionNumber
        })
    }

    const incrementQuestionNumber = async (code) => {
        try {
            let room = await getRoomFromCode(code);
            await setQuestionNumber(code, room.data.questionNumber + 1);
        } catch (err) {
            console.log(err);
        }
    }
    
    // assuming we have the room doc 
    const updateName = async (code, newName) => {
        let tempObj = {}
        tempObj["name"] = newName; 

        const doc = roomsRef.doc(code);

        await doc.update(tempObj) 
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    }

    const addQuestion = async (code, prompt, answers, index) => {
        try {
            await roomsRef.doc(code).collection("questions").add({
                prompt: prompt,
                index: index, 
                answers: answers
            });
            console.log("success");
        } catch(err) {
            console.log("fail");
        }
    }

    const getUser = async (code, deviceId) => {
        let usersRef = roomsRef.doc(code).collection('users');
        const docs = usersRef.get();

        const docsResponse = await docs.then().catch((err) => {
            console.log("Error getting doc", err);
        });

        let tempArr = [];

        docsResponse.forEach((doc) => {
            if (doc.data()['device_id'] == deviceId) {
                tempArr.push({id: doc.id, data: doc.data()});
            }
        });

        return tempArr.length == 0 ? null : tempArr[0];
    }

    const setUserStates = async (code, state) => {
        try {
            let usersRef = roomsRef.doc(code).collection('users');
            usersRef.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.update({
                        state: state
                    });
                });
            });
        } catch (err) {
            console.log(err);
        }
    }

    const addUser = async (state, deviceId, name, code) => {
        try {
            await roomsRef.doc(code).collection("users").add({
                state: state,
                name: name,
                device_id: deviceId,
                score: 0,
            });
            console.log("success");
        } catch(err) {
            console.log("fail");
        }
    }

    const updateUser = async (id, code, score) => {
        try {
            await roomsRef.doc(code).collection('users').doc(id).update({
                score: score
            });
            console.log("success");
        } catch(err) {
            console.log("fail");
        }
    }

    const setUserState = async (code, deviceId, state) => {
        let usersRef = roomsRef.doc(code).collection('users');
        const docs = usersRef.get();

        const docsResponse = await docs.then().catch((err) => {
            console.log("Error getting doc", err);
        });
        
        let tempArr = [];
        
        docsResponse.forEach((doc) => {
            if (doc.data()['device_id'] == deviceId) {
                tempArr.push({id: doc.id, data: doc.data()});
            }
        });

        const id = tempArr[0]['id'];

        await roomsRef.doc(code).collection('users').doc(id).update({
            state: state
        })
    }

    // Untested
    const resetUsers = async (code) => {
        try {
            let batch = firestore.batch();
            let docs = await roomsRef.doc(code).collection('users').listDocuments();
            docs.forEach(doc => {
               batch.delete(doc);
            })
            await batch.commit()
        } catch (err) {
            console.log(err);
        }
    }

    const resetQuestions = async (code) => {
        try {
            let batch = firestore.batch();
            let docs = await roomsRef.doc(code).collection('questions').listDocuments();
            docs.forEach(doc => {
               batch.delete(doc);
            })
            await batch.commit()
        } catch (err) {
            console.log(err);
        }
    }

    const incrementUserScoreFromDeviceId = async (code, deviceId) => {
        let usersRef = roomsRef.doc(code).collection('users');
        const docs = usersRef.get();

        const docsResponse = await docs.then().catch((err) => {
            console.log("Error getting doc", err);
        });
        
        let tempArr = [];
        
        docsResponse.forEach((doc) => {
            if (doc.data()['device_id'] == deviceId) {
                tempArr.push({id: doc.id, data: doc.data()});
            }
        });

        const id = tempArr[0]['id'];
        const score = tempArr[0]['data']['score'];

        const newScore = score + 1;

        updateUser(id, code, newScore);
    }

    return { getRooms, getRoomFromCode, getRoomFromName, 
             setRoom, updateName, addQuestion, resetUsers,
             setState, setOwnerId, setQuestionNumber, incrementQuestionNumber,
             addUser, getQuestionsFromCode, incrementUserScoreFromDeviceId,
             setUserState, getUser, setUserStates, getUsersFromCode, resetQuestions }
})();

exports.serviceFunctions = serviceFunctions; 