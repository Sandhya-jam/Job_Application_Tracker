import { useCreateMutation } from '../../Redux/api/jobsApiSlice'
import { useEffect, useState } from 'react'
import { motion,AnimatePresence} from 'framer-motion'
import { useSelector} from 'react-redux'
import {useForm,Controller} from 'react-hook-form'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fixedStages = ["Applied", "Interview", "Offer", "Accepted", "Rejected"];

const CreateForm = () => {
    const {register,handleSubmit,control,watch}=useForm({
      defaultValues:{
        title:"",
        role:"Intern",
        company:"",
        location:"",
        jobUrl:"",
        notes:"",
        curr_status:"Applied",
        contacts:[],
        fixedStageDates:{},
        customStages:{}
      }
    });

    const [customStages,setCustomStages]=useState({});
    const [createJob,{isLoading}]=useCreateMutation()
    const [fixedStageDates,setFixedStageDates]=useState({
        Applied:new Date(),
        Interview:null,
        Offer:null,
        Rejected:null,
        Accepted:null
    });
    const [contacts,setContacts]=useState([
      {name:"",email:"",phone:"",position:"",notes:""}
    ]);

    const normalizedFixedStageDates = {};
    Object.entries(fixedStageDates).forEach(([stage, date]) => {
      if (date) {
        normalizedFixedStageDates[stage] = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
      }
    });
    
    const normalizedCustomStages = {};
      Object.entries(customStages).forEach(([baseStage, stages]) => {
        normalizedCustomStages[baseStage] = stages.map(s => ({
          ...s,
          date: s.date
            ? new Date(s.date.getFullYear(), s.date.getMonth(), s.date.getDate())
            : null
      }));
    });

   const addCustomStage=(afterStage)=>{
     const stageName = prompt(`Enter name of custom stage after "${afterStage}"`);
     if (stageName) {
      setCustomStages((prev) => ({
        ...prev,
        [afterStage]: [
          ...(prev[afterStage] || []),
          { name: stageName, date: null }
        ]
      }));
    }
   };
   
   const handleFixedDateChange = (stageName, date) => {
      setFixedStageDates(prev => ({
        ...prev,
        [stageName]: new Date(date),
      }));
    };

   const removeCustomStage=(afterStage,index)=>{
     console.log("Clicked")
     setCustomStages((prev)=>{
       const updated=[...prev[afterStage]];
       updated.slice(index,1);
       return {...prev,[afterStage]:updated}
     })
   };

   const addContact=()=>{
    setContacts([...contacts,{name:"",email:"",phone:"",position:"",notes:""}])
   };

   const removeContact=(index)=>{
    const updatedContacts=contacts.filter((_,i)=>i!=index);
    setContacts(updatedContacts)
   };

   const handleContactChange=(index,field,value)=>{
      const updatedContacts=[...contacts]
      updatedContacts[index][field]=value
      setContacts(updatedContacts)
   };

   const submitHandler=async(data)=>{
     const payload={
      ...data,
      customStages:normalizedCustomStages,
      fixedStageDates:normalizedFixedStageDates
     };
     console.log(data)
     try {
       const res=await createJob(payload).unwrap()
       toast.success('Job Created Sucessfully')
     } catch (error) {
       toast.error(error.data.message)
     }
   };
   
   useEffect(()=>{

   },[customStages]);

  return (
    <div className="h-[60vh] max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Job</h1>

      <form 
      onSubmit={handleSubmit(submitHandler)}
      className='space-y-5'>
        {/* Job INfo */}
        <div className="grid sm:grid-cols-2 gap-4">
          <input 
          {...register("title",{required:true})}
          placeholder='Job Title'
          className='border p-2 rounded w-full'
          />
          <select 
          {...register("role")}
          className='border p-2 rounded w-full'
          >
            <option value="Intern">Intern</option>
            <option value="FTE">FTE</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <input 
          {...register("company",{required:true})}
          placeholder='Company'
          className='border p-2 rounded w-full'
          />
          <input 
          {...register("location",{required:true})}
          placeholder='Location'
          className='border p-2 rounded w-full' 
          />
        </div>
        <input 
        {...register("jobUrl")}
        placeholder='Job Url'
        className='border p-2 rounded w-full'
        />
        <textarea
        {...register("notes")}
        placeholder='Notes'
        className='border p-2 rounded w-full'/>

        {/* Stages Section */}
        <div>
          <h2 className="font-semibold mb-3 text-lg">Stages</h2>
          {fixedStages.map((stage,index)=>{
            return (
               <motion.div
               key={stage}
               initial={{opacity:0,y:5}}
               animate={{opacity:1,y:0}}
               className='mb-5 p-4 border rounded-lg shadow-sm bg-white'
               >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{stage}</span>
                  <button
                  type='button'
                  onClick={()=>addCustomStage(stage)}
                  className='text-sm text-blue-600 hover:text-blue-400 hover:cursor-pointer'
                  >
                   +Add Stage after
                  </button>
                </div>

                <DatePicker
                  selected={fixedStageDates[stage]}
                  onChange={(date) => handleFixedDateChange(stage, date)}
                  //dateFormat="yyyy-MM-dd"
                  placeholderText={`Select ${stage} date`}
                  //disabled={isStageDisabled(idx)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />

               {/*Custom Stages  */}
               <AnimatePresence>
                 {customStages[stage]?.map((c,i)=>(
                   <motion.div
                   key={c.name+i}
                   initial={{opacity:0,x:-10}}
                   animate={{opacity:1,x:0}}
                   exit={{opacity:0,x:10}}
                   className='mt-4 border-l-4 border-blue-500 pl-3 flex justify-between items-center'
                   >
                    <div className="flex-1">
                      <div className="text-sm font-medium">{c.name}</div>
                      <DatePicker
                       selected={c.date?new Date(c.date):null}
                       onChange={(date)=>{
                         const updated=[...customStages[stage]];
                         updated[i].date=date;
                         setCustomStages({
                          ...customStages,
                          [stage]:updated
                         });
                       }}
                       className='mt-1 border p-1 rounded w-full'
                       placeholderText='Select Date'
                       //disabled={!prevDate}
                      />
                    </div>
                    <button
                    type='button'
                    onClick={()=>removeCustomStage(stage,i)}
                    className='ml-3 text-red-500 hover:text-red-700 hover:cursor-pointer'
                    >
                      X
                    </button>
                   </motion.div>
                 ))}
               </AnimatePresence>
               </motion.div>
            )
          })}
        </div>
        {/* Contacts */}
        <div>
          <h2 className="font-semibold mb-3 text-lg">Contacts</h2>
          {contacts.map((contact, index) => (
          <div key={index} 
          className='space-y-5 rounded'
          style={{ border: "2px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <div className="grid sm:grid-cols-2 gap-4">
          <input 
          value={contact.name}
          placeholder='Name'
          type='text'
          className='border p-2 rounded w-full'
          onChange={(e) => handleContactChange(index, "name", e.target.value)}
          />
          <input 
          value={contact.email}
          placeholder='email'
          type='email'
          className='border p-2 rounded w-full'
          onChange={(e) => handleContactChange(index, "email", e.target.value)}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input 
          value={contact.position}
          placeholder='position'
          type='text'
          className='border p-2 rounded w-full'
          onChange={(e) => handleContactChange(index, "position", e.target.value)}
          />
          <input 
          value={contact.phone}
          placeholder='phone'
          type='text'
          className='border p-2 rounded w-full'
          onChange={(e) => handleContactChange(index, "phone", e.target.value)}
          />
        </div>
        <textarea
          type='text'
          value={contact.notes}
          placeholder='Notes'
          className='border rounded-sm w-full p-2'
          onChange={(e)=>handleContactChange(index,"notes",e.target.value)}
          />
          {contacts.length > 1 && (
            <button type="button" 
            className='hover:cursor-pointer'
            onClick={() => removeContact(index)}>
              Remove Contact
            </button>
          )}
        </div>
      ))}

      <button type='button'
      onClick={addContact}
      className='hover:cursor-pointer'>
        +Add Contact
      </button>
        
      </div>
        <button
        type='submit'
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full sm:w-auto"
        >Create Job</button>
      </form>
    </div>
  )
}

export default CreateForm