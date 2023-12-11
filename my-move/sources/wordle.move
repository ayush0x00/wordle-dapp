module wordle_game::play_wordle{
    use std::debug;
    use std::vector;
    use std::signer;
    use std::simple_map::{SimpleMap,Self};

    struct ColorCoding has key {
        correct:u8, //0
        incorrect:u8,//2
        partially:u8 //1
    }

    struct IdToWordle has key,copy {
        idWordleMap : SimpleMap<u64,Wordle> //maps an UID to Wordle
    }

    struct Wordle has key,copy,drop,store {
        word:vector<u8>, //wordle answer
        id:u64,
        length:u64, //length of wordle answer
        states_formed:SimpleMap<u8,vector<u8>>, //mapping contains attempts=>keys_pressed
        curr_state_color:SimpleMap<u8,vector<u8>> //mapping containing attempts=>color_coding
    }

    // init function to initialize all the state of user when a new wordle is created
    public entry fun populate_word(account:&signer,wordle_id:u64,wordle:vector<u8>) acquires IdToWordle{
        let length:u64 = vector::length<u8>(&wordle);
        let states_map:SimpleMap<u8,vector<u8>> = simple_map::create();
        let curr_state_color:SimpleMap<u8,vector<u8>> = simple_map::create();
        let w = Wordle {word:wordle,id:wordle_id,length,states_formed:states_map,curr_state_color};
        let idWordleMap:SimpleMap<u64,Wordle> = simple_map::create();
        if(!exists<IdToWordle>(signer::address_of(account))) move_to(account,IdToWordle{idWordleMap});
        let _idWordleMap = &mut borrow_global_mut<IdToWordle>(signer::address_of(account)).idWordleMap;
        simple_map::add(_idWordleMap,wordle_id ,w);
    }

    public fun getWord(account:&signer):vector<u8> acquires Wordle{
        return borrow_global<Wordle>(signer::address_of(account)).word
    }

    // function to populate the states_formed field whenever a key is pressed
    public entry fun pressedKey(account:&signer, _wordleId:u64, attempt:u8, idx:u8, key:u8) acquires IdToWordle{
        let w_map = &mut borrow_global_mut<IdToWordle>(signer::address_of(account)).idWordleMap;
        let wordle = simple_map::borrow_mut(w_map,&_wordleId);
        let state_map = &mut wordle.states_formed;
        if(simple_map::contains_key(state_map,&attempt)){
            let attempt_vec = simple_map::borrow_mut(state_map,&attempt);
            vector::insert(attempt_vec,(idx as u64),key);
        }
        else{
            let attempt_vec = vector::empty<u8>();
            vector::insert(&mut attempt_vec,(idx as u64),key);
            simple_map::add(state_map,attempt,attempt_vec);
        }
    }

    
    // function to populate curr_state_colour field to check if the value of wordle is correct or not
    public entry fun saveColors(account:&signer,_wordleId:u64,_attempt:u8,_currIdx:u8,key:u8) acquires IdToWordle{
        let w_map = &mut borrow_global_mut<IdToWordle>(signer::address_of(account)).idWordleMap;
        let answer = simple_map::borrow(w_map,&_wordleId).word;
        let mutableMap = simple_map::borrow_mut(w_map,&_wordleId);
        let currStateColorMap = &mut mutableMap.curr_state_color;
        let color = get_next_state_byIdx(answer,key,_currIdx);

        if(simple_map::contains_key(currStateColorMap,&_attempt)){
            let attempt_vec = simple_map::borrow_mut(currStateColorMap,&_attempt);
            vector::insert(attempt_vec,(_currIdx as u64),color);
        }
        else{
            let attempt_vec = vector::empty<u8>();
            vector::insert(&mut attempt_vec,(_currIdx as u64),color);
            simple_map::add(currStateColorMap,_attempt,attempt_vec);
        }
    }
    
    // fetch next state on the basis of curr_state and the index of letters 
    public fun get_next_state_byIdx(answer:vector<u8>, curr_state:u8, curr_idx:u8): u8{
        let expected_res = *vector::borrow(&answer,(curr_idx as u64));
        if(expected_res == curr_state) 
        {
            return (0 as u8)
        }
        else
        {
            if(vector::contains(&answer,&curr_state))
            {
                return (1 as u8)
            }
            else
            {
                return (2 as u8)
            }
        }
    }

    public fun get_next_state(account:&signer, curr_state:vector<u8>):(vector<u8>) acquires Wordle{
        let next_state = vector::empty<u8>();
        let obtained_word = borrow_global<Wordle>(signer::address_of(account)).word;
        let len = vector::length<u8>(&curr_state);
        let i:u64 = 0;
        while(i < len){
            let same = (*vector::borrow(&obtained_word,i)) ^ (*vector::borrow(&curr_state,i));
            if(same == (0 as u8))
            {
                vector::insert(&mut next_state,i,same);
            }
            else
            {
                let currWord = vector::borrow(&curr_state,i);
                if(vector::contains(&obtained_word,currWord))
                {
                    vector::insert(&mut next_state,i,(2 as u8));
                }
                else{
                    vector::insert(&mut next_state,i,(3 as u8));
                };
            };
            i = i+1;
        };
        return (next_state)
    }

    public fun print_content(greet:vector<u8>){
        let len = vector::length<u8>(&greet);
        debug::print(&len);
        let i:u64=0;
        while (i < len)
        {
            let char = (vector::borrow_mut<u8>(&mut greet,i));
            debug::print(char); 
            i = i+1;
        };
    }
    
    #[test(account=@0x123)]
    fun testPopulateWord(account:&signer) acquires IdToWordle{
        let id:u64=45;
        let id2:u64 = 54;
        let word = (vector[97,99,115,117,45]:vector<u8>);
        populate_word(account,id,word);

       let word2= (vector[97,99,115,117,45]:vector<u8>);
       populate_word(account,id2,word2);

    }
}
