import React from 'react';
import {testimonialsData} from "../constant/testimonials.js";
import {AiOutlineSun} from "react-icons/ai";

const Testimonials = () => {

    return (
        <div id={'testimonials'}
             className={`flex flex-col gap-y-8`}>
            <h1 className={'text-3xl sm:text-5xl font-bold mb-8 text-light text-center'}>
                Happy clients and what they <br/>
                had to say about us.
            </h1>

        {/*Testimonials list*/}
            <section className={`grid gap-y-8 gap-x-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}>
                {
                    testimonialsData.map((item) => (
                        <div className={'w-[330px]  sm:w-[350px] border border-stone-700 p-4 bg-base rounded-xl flex flex-col gap-y-4'}>
                            <img src={item.img} alt={item.title}
                                 className={'object-cover w-full h-48 rounded-xl'} />

                            {/*titles detail*/}
                            <div className={'flex justify-between items-center'}>
                                <div className={'flex flex-col'}>
                                    <h2 className={'text-light text-xl font-bold'}>{item.name}</h2>
                                    <p className={'text-light/70 text-sm'}>{item.role}</p>
                                </div>
                                <div className={'flex items-center gap-x-1'}>
                                    <AiOutlineSun/>
                                    <span>Starblow</span>
                                </div>
                            </div>

                            <hr className={'my-2 text-stone-500'} />

                            <p className={'text-stone-400'}>
                                {item.quote}
                            </p>

                        </div>
                    ))
                }
            </section>
        </div>
    );
};

export default Testimonials;