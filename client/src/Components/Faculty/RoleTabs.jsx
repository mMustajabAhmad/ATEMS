import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Route, Routes } from 'react-router-dom';

import GetSynopsis from './GetSynopsis';
import GetSynopsisDetails from './GetSynopsisDetails';
import MSRCAllThesis from './MSRCAllThesis';
import MSRCThesisDetails from './MSRCThesisDetails';


const RoleTabs = () => {

    <Routes>
        <Route path='/MSRCAllThesis' element={<MSRCAllThesis />} />
        <Route path='/MSRCThesisDetails/:thesisid' element={<MSRCThesisDetails />} />
        <Route path='/supAllRequests' element={<GetSynopsis />} />
        <Route path='/supReviewRequest/:synopsisid' element={<GetSynopsisDetails />} />
    </Routes>

    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <>

            <div className="card mt-1">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Supervisor">
                        {/* <p className="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p> */}
                    </TabPanel>
                    <TabPanel header="Internal">
                        {/* <p className="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
                            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
                            ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p> */}
                    </TabPanel>
                    <TabPanel header="MSRC">
                        {/* <p className="m-0">
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                            culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                        </p> */}
                    </TabPanel>
                </TabView>
            </div>
        </>
    )
}

export default RoleTabs;