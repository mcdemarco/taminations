/*

    Copyright 2011 Brad Christie

    This file is part of TAMinations.

    TAMinations is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    TAMinations is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with TAMinations.  If not, see <http://www.gnu.org/licenses/>.

 */

//  All the menus, as an array of menu objects,
//  containing arrays of menuitem objects
var tamination_menu =
 [{title:"Info",columns:1,menu:
  [{text:"Introduction",link:"info/index.html"},
   {text:"How to Use",link:"info/howtouse.html"},
   {text:"Troubleshooting",link:"info/trouble.html"},
   {text:"Linking",link:"info/howtolink.html"},
   {text:"Download",link:"info/download.html"},
   {text:"Embed",link:"info/embed.html"}]},

  {title:"General",columns:1,menu:
   [{text:"Objective",link:"ms/objective.html"},
    {text:"Couples",link:"ms/couples.html"},
    {text:"Facing Couples Rule",link:"ms/facing_couples_rule.html"},
    {text:"Facing Dancers",link:"ms/facing_dancers.html"},
    {text:"Ocean Wave Rule",link:"ms/ocean_wave_rule.html"},
    {text:"Passing Rule",link:"ms/passing_rule.html"},
    {text:"Same Position Rule",link:"ms/same_position_rule.html"},
    {text:"Starting Formations",link:"ms/starting_formations.html"}]},

  {title:"Styling",columns:1,menu:
   [{text:"Arms in Natural Dance Position",link:"ms/arms_natural.html"},
    {text:"Bow to Your Corner",link:"ms/bow_to_your_corner.html"},
    {text:"Bow to Your Partner",link:"ms/bow_to_your_partner.html"},
    {text:"Box Star",link:"ms/box_star.html"},
    {text:"Couple Handhold",link:"ms/couple_handhold.html"},
    {text:"Dance Step",link:"ms/dance_step.html"},
    {text:"Forearm Hold",link:"ms/forearm_hold.html"},
    {text:"Hands Up",link:"ms/hands_up.html"},
    {text:"Handshake Hold",link:"ms/handshake_hold.html"},
    {text:"Loose Handhold",link:"ms/loose_handhold.html"},
    {text:"Palm Star",link:"ms/palm_star.html"},
    {text:"Posture",link:"ms/posture.html"},
    {text:"Promenade Ending Twirl",link:"ms/promenade_ending_twirl.html"},
    {text:"Pull By",link:"ms/pull_by.html"},
    {text:"Skirt Work",link:"ms/skirt_work.html"}]},

  {title:"Mainstream",columns:4,menu:
   [{text:"Alamo Ring",link:"ms/ocean_wave.html?AllemandeLefttoanAlamoRingfromStaticSquare"},
    {text:"All Around the Corner",link:"ms/all_around_the_corner.html"},
    {text:"Allemande Left",link:"ms/allemande.html?AllemandeLeftfromStaticSquare"},
    {text:"Allemande Thar",link:"ms/thar.html"},
    {text:"Backtrack",link:"ms/turn_back.html"},
    {text:"Bend the Line",link:"ms/bend_the_line.html"},
    {text:"Box the Gnat",link:"ms/box_the_gnat.html"},
    {text:"California Twirl",link:"ms/california_twirl.html"},
    {text:"Cast Off Three Quarters",link:"ms/cast_off_three_quarters.html"},
    {text:"Centers In",link:"ms/centers_in.html"},
    {text:"Chain Down the Line",link:"ms/ladies_chain.html?ChainDowntheLinefromTwoFacedLines"},
    {text:"Circle Left and Circle Right",link:"ms/circle.html"},
    {text:"Circle to a Line",link:"ms/circle_to_a_line.html"},
    {text:"Circulate",link:"ms/circulate.html"},
    {text:"Cloverleaf",link:"ms/cloverleaf.html"},
    {text:"Courtesy Turn",link:"ms/courtesy_turn.html"},
    {text:"Cross Fold",link:"ms/fold.html?EndsCrossFoldfromLinesFacingOut"},
    {text:"Cross Run",link:"ms/run.html?CentersCrossRunfromRightHandWaves"},
    {text:"Dive Thru",link:"ms/dive_thru.html"},
    {text:"Dixie Style to an Ocean Wave",link:"ms/dixie_style.html"},
    {text:"Do Paso",link:"ms/do_paso.html"},
    {text:"Dosado",link:"ms/dosado.html"},
    {text:"Double Pass Thru",link:"ms/double_pass_thru.html"},
    {text:"Eight Chain Thru",link:"ms/eight_chain_thru.html"},
    {text:"Extend",link:"ms/extend.html"},
    {text:"Ferris Wheel",link:"ms/ferris_wheel.html"},
    {text:"First Couple Go Left/Right..",link:"ms/first_couple_go.html"},
    {text:"Flutterwheel",link:"ms/flutterwheel.html"},
    {text:"Fold",link:"ms/fold.html"},
    {text:"Forward and Back",link:"ms/forward_and_back.html"},
    {text:"Grand Square",link:"ms/grand_square.html"},
    {text:"Half Sashay",link:"ms/sashay.html"},
    {text:"Half Tag",link:"ms/tag.html?HalfTagfromRightHandTwoFacedLines"},
    {text:"Hinge",link:"ms/hinge.html"},
    {text:"Ladies In, Men Sashay",link:"ms/sashay.html"},
    {text:"Ladies Chain",link:"ms/ladies_chain.html"},
    {text:"Lead Right",link:"ms/lead_right.html"},
    {text:"Left Arm Turn",link:"ms/arm_turns.html"},
    {text:"Ocean Wave",link:"ms/ocean_wave.html"},
    {text:"Pass the Ocean",link:"ms/pass_the_ocean.html"},
    {text:"Pass Thru",link:"ms/pass_thru.html"},
    {text:"Pass to the Center",link:"ms/pass_to_the_center.html"},
    {text:"Promenade",link:"ms/promenade.html"},
    {text:"Recycle",link:"ms/recycle.html"},
    {text:"Reverse Flutterwheel",link:"ms/flutterwheel.html?ReverseFlutterwheelfromFacingCouples"},
    {text:"Right and Left Grand",link:"ms/right_and_left_grand.html"},
    {text:"Right and Left Thru",link:"ms/right_and_left_thru.html"},
    {text:"Right Arm Turn",link:"ms/arm_turns.html"},
    {text:"Right (Left) Hand Star",link:"ms/star.html"},
    {text:"Rollaway",link:"ms/sashay.html?RollawayfromLines"},
    {text:"Run",link:"ms/run.html"},
    {text:"Scoot Back",link:"ms/scoot_back.html"},
    {text:"See Saw",link:"ms/see_saw.html"},
    {text:"Separate",link:"ms/separate.html"},
    {text:"Shoot the Star",link:"ms/shoot_the_star.html"},
    {text:"Slide Thru",link:"ms/slide_thru.html"},
    {text:"Slip the Clutch",link:"ms/slip_the_clutch.html"},
    {text:"Spin Chain Thru",link:"ms/spin_chain_thru.html"},
    {text:"Spin the Top",link:"ms/spin_the_top.html"},
    {text:"Split Circulate",link:"ms/circulate.html?SplitCirculatefromRightHandWaves"},
    {text:"Split the Outside Couple",link:"ms/split_the_outside_couple.html"},
    {text:"Square Thru",link:"ms/square_thru.html"},
    {text:"Star Promenade",link:"ms/star_promenade.html"},
    {text:"Star Thru",link:"ms/star_thru.html"},
    {text:"Sweep a Quarter",link:"ms/sweep_a_quarter.html"},
    {text:"Swing",link:"ms/swing.html"},
    {text:"Swing Thru",link:"ms/swing_thru.html"},
    {text:"Tag the Line, Half Tag",link:"ms/tag.html"},
    {text:"Touch a Quarter",link:"ms/touch_a_quarter.html"},
    {text:"Trade",link:"ms/trade.html"},
    {text:"Trade By",link:"ms/trade_by.html"},
    {text:"Turn Back",link:"ms/turn_back.html"},
    {text:"Turn Thru",link:"ms/turn_thru.html"},
    {text:"Veer Left, Veer Right",link:"ms/veer.html"},
    {text:"Walk and Dodge",link:"ms/walk_and_dodge.html"},
    {text:"Walk Around the Corner",link:"ms/all_around_the_corner.html"},
    {text:"Weave the Ring",link:"ms/right_and_left_grand.html?WeavetheRing"},
    {text:"Wheel and Deal",link:"ms/wheel_and_deal.html"},
    {text:"Wheel Around",link:"ms/wheel_around.html"},
    {text:"Wrong Way Grand",link:"ms/right_and_left_grand.html?WrongWayGrand"},
    {text:"Wrong Way Thar",link:"ms/thar.html?WrongWayTharfromLeftHandTharStar"},
    {text:"Zoom",link:"ms/zoom.html"}]},

  {title:"Plus",columns:2,menu:
   [{text:"Acey Deucey",link:"plus/acey_deucey.html"},
    {text:"All 8 Spin the Top",link:"plus/all_8_spin_the_top.html"},
    {text:"Anything and Roll",link:"plus/anything_and_roll.html"},
    {text:"Anything and Spread",link:"plus/anything_and_spread.html"},
    {text:"Chase Right",link:"plus/chase_right.html"},
    {text:"Coordinate",link:"plus/coordinate.html"},
    {text:"Crossfire",link:"plus/crossfire.html"},
    {text:"Cut the Diamond",link:"plus/cut_the_diamond.html"},
    {text:"Diamond Circulate",link:"plus/diamond_circulate.html"},
    {text:"Dixie Grand",link:"plus/dixie_grand.html"},
    {text:"Explode and Anything",link:"plus/explode_and_anything.html"},
    {text:"Explode the Wave",link:"plus/explode_the_wave.html"},
    {text:"Extend",link:"plus/extend.html"},
    {text:"Fan the Top",link:"plus/fan_the_top.html"},
    {text:"Flip the Diamond",link:"plus/flip_the_diamond.html"},
    {text:"Follow Your Neighbor",link:"plus/follow_your_neighbor.html"},
    {text:"Grand Swing Thru",link:"plus/grand_swing_thru.html"},
    {text:"Left Chase",link:"plus/chase_right.html?LeftChasefromCouplesFacingOut"},
    {text:"Linear Cycle",link:"plus/linear_cycle.html"},
    {text:"Load the Boat",link:"plus/load_the_boat.html"},
    {text:"Peel Off",link:"plus/peel_off.html"},
    {text:"Peel the Top",link:"plus/peel_the_top.html"},
    {text:"Ping Pong Circulate",link:"plus/ping_pong_circulate.html"},
    {text:"Relay the Deucey",link:"plus/relay_the_deucey.html"},
    {text:"Single Circle to a Wave",link:"plus/single_circle_to_a_wave.html"},
    {text:"Spin Chain and Exchange the Gears",link:"plus/spin_chain_and_exchange_the_gears.html"},
    {text:"Spin Chain the Gears",link:"plus/spin_chain_the_gears.html"},
    {text:"Teacup Chain",link:"plus/teacup_chain.html"},
    {text:"Three Quarters Tag the Line",link:"plus/three_quarters_tag_the_line.html"},
    {text:"Track Two",link:"plus/track_ii.html"},
    {text:"Trade the Wave",link:"plus/trade_the_wave.html"}]},

  {title:"Advanced",columns:4,menu:
   [{text:"All 4 Couples / All 8",link:"adv/all_4_all_8.html"},
    {text:"Anything and Cross",link:"adv/anything_and_cross.html"},
    {text:"Any Hand Concept",link:"adv/any_hand_concept.html"},
    {text:"As Couples Concept",link:"adv/as_couples.html"},
    {text:"Belles and Beaus",link:"adv/belles_and_beaus.html"},
    {text:"Box Counter Rotate",link:"adv/box_counter_rotate.html"},
    {text:"Box Transfer",link:"adv/box_transfer.html"},
    {text:"Cast a Shadow",link:"adv/cast_a_shadow.html"},
    {text:"Chain Reaction",link:"adv/chain_reaction.html"},
    {text:"Checkmate",link:"adv/checkmate.html"},
    {text:"Clover and Anything",link:"adv/clover_and_anything.html"},
    {text:"Cross",link:"adv/named_dancers_cross.html"},
    {text:"Cross Clover and Anything",link:"adv/cross_clover_and_anything.html"},
    {text:"Cross Over Circulate",link:"adv/cross_over_circulate.html"},
    {text:"Cross Trail Thru",link:"adv/cross_trail_thru.html"},
    {text:"Cut the Hourglass",link:"adv/cut_the_hourglass.html"},
    {text:"Cycle and Wheel",link:"adv/cycle_and_wheel.html"},
    {text:"Diamond Chain Thru",link:"adv/diamond_chain_thru.html"},
    {text:"Double Star Thru",link:"adv/double_star_thru.html"},
    {text:"Ends Bend",link:"adv/ends_bend.html"},
    {text:"Explode and Anything",link:"adv/explode_and_anything.html"},
    {text:"Explode the Line",link:"adv/explode_the_line.html"},
    {text:"Flip the Hourglass",link:"adv/flip_the_hourglass.html"},
    {text:"Fractional Tops",link:"adv/fractional_tops.html"},
    {text:"Grand Follow Your Neighbor",link:"adv/grand_follow_your_neighbor.html"},
    {text:"Grand Quarter Thru",link:"adv/grand_quarter_thru.html"},
    {text:"Grand Remake",link:"adv/grand_remake.html"},
    {text:"Grand Three-Quarter Thru",link:"adv/grand_three_quarter_thru.html"},
    {text:"Half Breed Thru",link:"adv/half_breed_thru.html"},
    {text:"Horseshoe Turn",link:"adv/horseshoe_turn.html"},
    {text:"Hourglass Circulate",link:"adv/hourglass_circulate.html"},
    {text:"In-Roll Circulate",link:"adv/in_roll_circulate.html"},
    {text:"Left Roll to a Wave",link:"adv/left_roll_to_a_wave.html"},
    {text:"Left Square Chain Thru",link:"adv/left_square_chain_thru.html"},
    {text:"Left Wheel Thru",link:"adv/left_wheel_thru.html"},
    {text:"Lock It",link:"adv/lock_it.html"},
    {text:"Mini Busy",link:"adv/mini_busy.html"},
    {text:"Mix",link:"adv/mix.html"},
    {text:"Named Dancers Cross",link:"adv/named_dancers_cross.html"},
    {text:"Motivate",link:"adv/motivate.html"},
    {text:"Out-Roll Circulate",link:"adv/out_roll_circulate.html"},
    {text:"Pair Off",link:"adv/pair_off.html"},
    {text:"Partner Hinge",link:"adv/partner_hinge.html"},
    {text:"Partner Tag",link:"adv/partner_tag.html"},
    {text:"Pass and Roll",link:"adv/pass_and_roll.html"},
    {text:"Pass and Roll Your Neighbor",link:"adv/pass_and_roll_your_neighbor.html"},
    {text:"Pass In",link:"adv/pass_in.html"},
    {text:"Pass Out",link:"adv/pass_out.html"},
    {text:"Pass the Sea",link:"adv/pass_the_sea.html"},
    {text:"Peel and Trail",link:"adv/peel_and_trail.html"},
    {text:"Quarter In",link:"adv/quarter_in.html"},
    {text:"Quarter Out",link:"adv/quarter_out.html"},
    {text:"Quarter Thru",link:"adv/quarter_thru.html"},
    {text:"Recycle",link:"adv/recycle.html"},
    {text:"Remake",link:"adv/remake.html"},
    {text:"Remake the Thar",link:"adv/remake_the_thar.html"},
    {text:"Reverse Swap Around",link:"adv/reverse_swap_around.html"},
    {text:"Right Roll to a Wave",link:"adv/right_roll_to_a_wave.html"},
    {text:"Scoot and Dodge",link:"adv/scoot_and_dodge.html"},
    {text:"Scoot and Weave",link:"adv/scoot_and_weave.html"},
    {text:"Scoot Chain Thru",link:"adv/scoot_chain_thru.html"},
    {text:"Single Wheel",link:"adv/single_wheel.html"},
    {text:"Six-Two Acey Deucey",link:"adv/six_two_acey_deucey.html"},
    {text:"Slide",link:"adv/slide.html"},
    {text:"Slip",link:"adv/slip.html"},
    {text:"Slither",link:"adv/slither.html"},
    {text:"Spin the Windmill",link:"adv/spin_the_windmill.html"},
    {text:"Split Counter Rotate",link:"adv/split_counter_rotate.html"},
    {text:"Split Square Chain Thru",link:"adv/split_square_chain_thru.html"},
    {text:"Split Square Thru",link:"adv/split_square_thru.html"},
    {text:"Split Transfer",link:"adv/split_transfer.html"},
    {text:"Square Chain Thru",link:"adv/square_chain_thru.html"},
    {text:"Step and Slide",link:"adv/step_and_slide.html"},
    {text:"Swap Around",link:"adv/swap_around.html"},
    {text:"Swing",link:"adv/swing.html"},
    {text:"Switch the Wave",link:"adv/switch_the_wave.html"},
    {text:"Switch to a Diamond",link:"adv/switch_to_a_diamond.html"},
    {text:"Switch to an Hourglass",link:"adv/switch_to_an_hourglass.html"},
    {text:"Three Quarter Thru",link:"adv/three_quarter_thru.html"},
    {text:"Trade Circulate",link:"adv/trade_circulate.html"},
    {text:"Trail Off",link:"adv/trail_off.html"},
    {text:"Transfer and Anything",link:"adv/transfer_and_anything.html"},
    {text:"Transfer the Column",link:"adv/transfer_the_column.html"},
    {text:"Triple Scoot",link:"adv/triple_scoot.html"},
    {text:"Triple Star Thru",link:"adv/triple_star_thru.html"},
    {text:"Triple Trade",link:"adv/triple_trade.html"},
    {text:"Turn and Deal",link:"adv/turn_and_deal.html"},
    {text:"Wheel Thru",link:"adv/wheel_thru.html"},
    {text:"Zig and Zag",link:"adv/zig_and_zag.html"}]},

  {title:"C-1",columns:4,menu:
   [{text:"Ah So",link:"c1/ah_so.html"},
    {text:"All Eight Recycle",link:"c1/all_eight_recycle.html"},
    {text:"Alter the Wave",link:"c1/alter_the_wave.html"},
    {text:"Anything and Spread",link:"c1/anything_and_spread.html"},
    {text:"Anything and Weave",link:"c1/anything_and_weave.html"},
    {text:"Anything Chain Thru",link:"c1/anything_chain_thru.html"},
    {text:"Anything the Windmill",link:"c1/anything_the_windmill.html"},
    {text:"Anything to a Wave",link:"c1/anything_to_a_wave.html"},
    {text:"Beaus and Belles",link:"c1/beaus_and_belles.html"},
    {text:"Block Formation",link:"c1/block_formation.html"},
    {text:"Box Recycle",link:"c1/box_split_recycle.html"},
    {text:"Butterfly Formation / Concept",link:"c1/butterfly_formation.html"},
    {text:"Cast a Shadow",link:"c1/cast_a_shadow.html"},
    {text:"Cast Back",link:"c1/cast_back.html"},
    {text:"Chain Reaction",link:"c1/chain_reaction.html"},
    {text:"Chase Your Neighbor",link:"c1/chase_your_neighbor.html"},
    {text:"Checkover",link:"c1/checkover.html"},
    {text:"Circle By",link:"c1/circle_by.html"},
    {text:"Circulate",link:"c1/circulate.html"},
    {text:"Concentric Concept",link:"c1/concentric_concept.html"},
    {text:"Counter Rotate",link:"c1/counter_rotate.html"},
    {text:"Cross and Turn",link:"c1/cross_and_turn.html"},
    {text:"Cross By",link:"c1/cross_by.html"},
    {text:"Cross Cast Back",link:"c1/cross_cast_back.html"},
    {text:"Cross Chain and Roll",link:"c1/cross_chain_and_roll.html"},
    {text:"Cross Chain Thru",link:"c1/cross_chain_thru.html"},
    {text:"Cross Extend",link:"c1/cross_extend.html"},
    {text:"Cross Roll",link:"c1/cross_roll.html"},
    {text:"Cross Your Neighbor",link:"c1/cross_your_neighbor.html"},
    {text:"Cut the Interlocked Diamond",link:"c1/cut_the_interlocked_diamond.html"},
    {text:"Dixie Diamond",link:"c1/dixie_diamond.html"},
    {text:"Dixie Sashay",link:"c1/dixie_sashay.html"},
    {text:"Flip Back",link:"c1/tagging_calls_back_to_a_wave.html"},
    {text:"Flip the Interlocked Diamond",link:"c1/flip_the_interlocked_diamond.html"},
    {text:"Flip the Line",link:"c1/flip_the_line.html"},
    {text:"Follow Thru",link:"c1/follow_thru.html"},
    {text:"Galaxy Circulate",link:"c1/galaxy_circulate.html"},
    {text:"Galaxy Formation",link:"c1/galaxy_formation.html"},
    {text:"Interlocked Diamond Circulate",link:"c1/interlocked_diamond_circulate.html"},
    {text:"Interlocked Diamond Formation",link:"c1/interlocked_diamond_formation.html"},
    {text:"Jaywalk",link:"c1/jaywalk.html"},
    {text:"Linear Action",link:"c1/linear_action.html"},
    {text:"Little",link:"c1/little.html"},
    {text:"Magic Column Circulate",link:"c1/magic_column_circulate.html"},
    {text:"Magic Column Formation",link:"c1/magic_column_formation.html"},
    {text:"Make Magic",link:"c1/make_magic.html"},
    {text:"O Formation / Concept",link:"c1/o_formation.html"},
    {text:"Pass the Axle",link:"c1/pass_the_axle.html"},
    {text:"Percolate",link:"c1/percolate.html"},
    {text:"Phantom Formation",link:"c1/phantom_formation.html"},
    {text:"Plenty",link:"c1/plenty.html"},
    {text:"Press Ahead",link:"c1/press.html"},
    {text:"Ramble",link:"c1/ramble.html"},
    {text:"Recycle",link:"c1/recycle.html"},
    {text:"Regroup",link:"c1/regroup.html"},
    {text:"Relay the Shadow",link:"c1/relay_the_shadow.html"},
    {text:"Relay the Top",link:"c1/relay_the_top.html"},
    {text:"Reverse Cross and Turn",link:"c1/reverse_cross_and_turn.html"},
    {text:"Reverse Explode",link:"c1/reverse_explode.html"},
    {text:"Reverse Rotate",link:"c1/reverse_rotate.html"},
    {text:"Reverse Single Rotate",link:"c1/reverse_single_rotate.html"},
    {text:"Reverse Wheel and Anything",link:"c1/reverse_wheel_and_anything.html"},
    {text:"Rotary Spin",link:"c1/rotary_spin.html"},
    {text:"Rotate",link:"c1/rotate.html"},
    {text:"Scatter Scoot",link:"c1/scatter_scoot.html"},
    {text:"Scatter Scoot Chain Thru",link:"c1/scatter_scoot_chain_thru.html"},
    {text:"Scoot and Little",link:"c1/scoot_and_little.html"},
    {text:"Scoot and Plenty",link:"c1/scoot_and_plenty.html"},
    {text:"Scoot and Ramble",link:"c1/scoot_and_ramble.html"},
    {text:"Shakedown",link:"c1/shakedown.html"},
    {text:"Siamese Concept",link:"c1/siamese_concept.html"},
    {text:"Single Rotate",link:"c1/single_rotate.html"},
    {text:"Split Recycle",link:"c1/box_split_recycle.html"},
    {text:"Split Square Thru Variations",link:"c1/split_square_thru_variations.html"},
    {text:"Square Chain the Top",link:"c1/square_chain_the_top.html"},
    {text:"Square the Bases",link:"c1/square_the_bases.html"},
    {text:"Squeeze",link:"c1/squeeze.html"},
    {text:"Squeeze the Hourglass",link:"c1/squeeze_the_hourglass.html"},
    {text:"Step and Flip",link:"c1/step_and_flip.html"},
    {text:"Step and Fold",link:"c1/step_and_fold.html"},
    {text:"Stretch Concept",link:"c1/stretch_concept.html"},
    {text:"Substitute",link:"c1/substitute.html"},
    {text:"Swing and Circle",link:"c1/swing_and_circle.html"},
    {text:"Swing the Fractions",link:"c1/swing_the_fractions.html"},
    {text:"Switch the Line",link:"c1/switch_the_line.html"},
    {text:"Switch to a Diamond",link:"c1/switch_to_a_diamond.html"},
    {text:"Switch to an Hourglass",link:"c1/switch_to_an_hourglass.html"},
    {text:"Switch to an Interlocked Diamond",link:"c1/switch_to_an_interlocked_diamond.html"},
    {text:"Tag Back to a Wave",link:"c1/tagging_calls_back_to_a_wave.html?TagBacktoaWavefromLines"},
    {text:"Tally Ho",link:"c1/tally_ho.html"},
    {text:"Tandem Concept",link:"c1/tandem_concept.html"},
    {text:"T-Bone Formation",link:"c1/t_bone_formation.html"},
    {text:"The Axle",link:"c1/the_axle.html"},
    {text:"Three by Two Acey Deucey",link:"c1/three_by_two_acey_deucey.html"},
    {text:"Triangle Circulate",link:"c1/triangle_circulate.html"},
    {text:"Triangle Formation",link:"c1/triangle_formation.html"},
    {text:"Triple Box/Column/Line/Wave Concept",link:"c1/triple_box_concept.html"},
    {text:"Triple Cross",link:"c1/triple_cross.html"},
    {text:"Twist and Anything",link:"c1/twist_and_anything.html"},
    {text:"Twist the Line",link:"c1/twist_the_line.html"},
    {text:"Two-Thirds Recycle",link:"c1/2_3_recycle.html"},
    {text:"Vertical Tag",link:"c1/vertical_tag.html"},
    {text:"Vertical Tag Back to a Wave",link:"c1/tagging_calls_back_to_a_wave.html#VerticalTag"},
    {text:"Wheel and Anything",link:"c1/wheel_and_anything.html"},
    {text:"Wheel Fan Thru",link:"c1/wheel_fan_thru.html"},
    {text:"With the Flow" ,link:"c1/with_the_flow.html"},
    {text:"Zing",link:"c1/zing.html"}]},

  {title:"C-2",columns:4,menu:
   [{text:"3 by 1 Checkmate the Column",link:"c2/3_by_1_checkmate_the_column.html"},
    {text:"3 by 1 Transfer the Column",link:"c2/3_by_1_transfer_the_column.html"},
    {text:"3 by 1 Triangle Circulate",link:"c2/3_by_1_triangle_circulate.html"},
    {text:"3 by 1 Triangle Formation" ,link:"c2/3_by_1_triangle_formation.html"},
    {text:"Along",link:"c2/along.html"},
    {text:"Alter and Circulate",link:"c2/alter_and_circulate.html"},
    {text:"Anything and Circle" ,link:"c2/anything_and_circle.html"},
    {text:"Anything Concept" ,link:"c2/anything_concept.html"},
    {text:"Anything the K" ,link:"c2/anything_the_k.html"},
    {text:"Bounce the (Anyone)" ,link:"c2/bounce_the_anyone.html"},
    {text:"Catch" ,link:"c2/catch.html"},
    {text:"Chain the Square",link:"c2/chain_the_square.html"},
    {text:"Checkpoint" ,link:"c2/checkpoint.html"},
    {text:"Chisel Thru",link:"c2/chisel_thru.html"},
    {text:"Circle to a Wave" ,link:"c2/circle_to_a_wave.html"},
    {text:"Counter" ,link:"c2/counter.html"},
    {text:"Crazy Concept" ,link:"c2/crazy_concept.html"},
    {text:"Criss Cross the Shadow" ,link:"c2/criss_cross_the_shadow.html"},
    {text:"Criss Cross Your Neighbor" ,link:"c2/criss_cross_your_neighbor.html"},
    {text:"Cross and Wheel" ,link:"c2/cross_and_wheel.html"},
    {text:"Cross Back" ,link:"c2/cross_back.html"},
    {text:"Cross Concentric Concept" ,link:"c2/cross_concentric_concept.html"},
    {text:"Cross Invert the Column" ,link:"c2/cross_invert_the_column.html"},
    {text:"Cross Kick Off" ,link:"c2/cross_kick_off.html"},
    {text:"Cross Ramble" ,link:"c2/cross_ramble.html"},
    {text:"Cross the K" ,link:"c2/cross_the_k.html"},
    {text:"Cross Trade and Wheel" ,link:"c2/cross_trade_and_wheel.html"},
    {text:"Cut the Galaxy" ,link:"c2/cut_the_galaxy.html"},
    {text:"Detour" ,link:"c2/detour.html"},
    {text:"Disconnected Concept" ,link:"c2/disconnected_concept.html"},
    {text:"Dodge Anything" ,link:"c2/dodge_anything.html"},
    {text:"Drop In / Drop Out",link:"c2/drop_in.html"},
    {text:"Drop Left / Drop Right" ,link:"c2/drop_right.html"},
    {text:"Exchange the Diamond" ,link:"c2/exchange_the_diamond.html"},
    {text:"Fascinate",link:"c2/fascinate.html"},
    {text:"Fascinating" ,link:"c2/fascinating.html"},
    {text:"File to a Line",link:"c2/file_to_a_line.html"},
    {text:"Flip the Galaxy" ,link:"c2/flip_the_galaxy.html"},
    {text:"Flip Your Neighbor" ,link:"c2/flip_your_neighbor.html"},
    {text:"Funny Concept" ,link:"c2/funny_concept.html"},
    {text:"Funny Square Thru" ,link:"c2/funny_square_thru.html"},
    {text:"Grand Chain Eight" ,link:"c2/grand_chain_eight.html"},
    {text:"Grand Cross Back" ,link:"c2/grand_cross_back.html"},
    {text:"Grand Cross Trade and Wheel" ,link:"c2/grand_cross_trade_and_wheel.html"},
    {text:"Grand Single Cross and Wheel" ,link:"c2/grand_single_cross_and_wheel.html"},
    {text:"Grand Single Cross Trade and Wheel",link:"c2/grand_single_cross_trade_and_wheel.html"},
    {text:"Here Comes the Judge" ,link:"c2/here_comes_the_judge.html"},
    {text:"Hocus Pocus" ,link:"c2/hocus_pocus.html"},
    {text:"Hubs Trade Back" ,link:"c2/hubs_trade_back.html"},
    {text:"Hubs Trade (Anything)" ,link:"c2/hubs_trade_anything.html"},
    {text:"Inlet" ,link:"c2/inlet.html"},
    {text:"Interlocked 3 by 1 Triangle Circulate" ,link:"c2/interlocked_3_by_1_triangle_circulate.html"},
    {text:"Interlocked Triangle Formation", link:"c2/interlocked_triangle_formation.html"},
    {text:"Invert the Column" ,link:"c2/invert_the_column.html"},
    {text:"Kick Off",link:"c2/kick_off.html"},
    {text:"Lateral Substitute" ,link:"c2/lateral_substitute.html"},
    {text:"Left Scoot and Counter" ,link:"c2/left_scoot_and_counter.html"},
    {text:"Like a Ripple" ,link:"c2/like_a_ripple.html"},
    {text:"Lines (Anything) Thru" ,link:"c2/lines_anything_thru.html"},
    {text:"Little More" ,link:"c2/little_more.html"},
    {text:"Loop" ,link:"c2/loop.html"},
    {text:"Offset Concept" ,link:"c2/offset_concept.html"},
    {text:"Once Removed Concept" ,link:"c2/once_removed_concept.html"},
    {text:"Outlet" ,link:"c2/outlet.html"},
    {text:"Parallelogram Concept" ,link:"c2/parallelogram_concept.html"},
    {text:"Peel to a Diamond",link:"c2/peel_to_a_diamond.html"},
    {text:"Perk Up",link:"c2/perk_up.html"},
    {text:"Relocate the Setup" ,link:"c2/relocate_the_setup.html"},
    {text:"Reshape the Triangle" ,link:"c2/reshape_the_triangle.html"},
    {text:"Reverse Crazy Concept" ,link:"c2/reverse_crazy_concept.html"},
    {text:"Reverse Cut the Diamond",link:"c2/reverse_cut_the_diamond.html"},
    {text:"Reverse Cut the Galaxy" ,link:"c2/reverse_cut_the_galaxy.html"},
    {text:"Reverse Flip the Diamond",link:"c2/reverse_flip_the_diamond.html"},
    {text:"Reverse Flip the Galaxy" ,link:"c2/reverse_flip_the_galaxy.html"},
    {text:"Reverse Rotate",link:"c2/reverse_rotate.html"},
    {text:"Reverse Single Rotate",link:"c2/reverse_single_rotate.html"},
    {text:"Reverse Split Swap Around" ,link:"c2/reverse_split_swap_around.html"},
    {text:"Reverse Truck",link:"c2/reverse_truck.html"},
    {text:"Rims Trade (Anything)" ,link:"c2/rims_trade_anything.html"},
    {text:"Rims Trade Back" ,link:"c2/rims_trade_back.html"},
    {text:"Ripple" ,link:"c2/ripple.html"},
    {text:"Ripple the Wave",link:"c2/ripple_the_wave.html"},
    {text:"Rotary" ,link:"c2/rotary.html"},
    {text:"Rotate",link:"c2/rotate.html"},
    {text:"Scoot and Counter" ,link:"c2/scoot_and_counter.html"},
    {text:"Scoot and Cross Ramble" ,link:"c2/scoot_and_cross_ramble.html"},
    {text:"Scoot and Little More" ,link:"c2/scoot_and_little_more.html"},
    {text:"Sets In Motion" ,link:"c2/sets_in_motion.html"},
    {text:"Shazam",link:"c2/shazam.html"},
    {text:"Single Bounce the (Anyone)" ,link:"c2/single_bounce_the_anyone.html"},
    {text:"Single Cross and Wheel" ,link:"c2/single_cross_and_wheel.html"},
    {text:"Single Cross Trade and Wheel",link:"c2/single_cross_trade_and_wheel.html"},
    {text:"Single Rotate",link:"c2/single_rotate.html"},
    {text:"Sock It To Me" ,link:"c2/sock_it_to_me.html"},
    {text:"Solid Concept" ,link:"c2/solid_concept.html"},
    {text:"Split Swap Around" ,link:"c2/split_swap_around.html"},
    {text:"Split Trade Circulate" ,link:"c2/split_trade_circulate.html"},
    {text:"Stack the Line" ,link:"c2/stack_the_line.html"},
    {text:"Stagger Concept" ,link:"c2/stagger_concept.html"},
    {text:"Stretched Concept" ,link:"c2/stretched_concept.html"},
    {text:"Swap the Wave" ,link:"c2/swap_the_wave.html"},
    {text:"Swing Along" ,link:"c2/swing_along.html"},
    {text:"Tag Your Neighbor" ,link:"c2/tag_your_neighbor.html"},
    {text:"Tandem Based Triangle" ,link:"c2/tandem_based_triangle.html"},
    {text:"Trail to a Diamond",link:"c2/trail_to_a_diamond.html"},
    {text:"Truck" ,link:"c2/truck.html"},
    {text:"Turn to a Line",link:"c2/turn_to_a_line.html"},
    {text:"Unwrap",link:"c2/unwrap.html"},
    {text:"Vertical (Anything)" ,link:"c2/vertical_anything.html"},
    {text:"Vertical Tag Your Neighbor" ,link:"c2/vertical_tag_your_neighbor.html"},
    {text:"Walk Out to a Wave" ,link:"c2/walk_out_to_a_wave.html"},
    {text:"Wheel the Ocean",link:"c2/wheel_the_ocean.html"},
    {text:"Wheel the Sea",link:"c2/wheel_the_sea.html"},
    {text:"Zip Code" ,link:"c2/zip_code.html"}]},

  {title:"C-3A",columns:4,menu:
   [{text:"1/4 Mix",link:"c3a/1_4_mix.html"},
    {text:"1/4 the Deucey",link:"c3a/1_4_the_deucey.html"},
    {text:"1/4 Wheel the Ocean",link:"c3a/1_4_wheel_the_ocean.html"},
    {text:"1/4 Wheel the Sea",link:"c3a/1_4_wheel_the_sea.html"},
    {text:"3/4 Mix",link:"c3a/3_4_mix.html"},
    {text:"3/4 the Deucey",link:"c3a/3_4_the_deucey.html"},
    {text:"3/4 Wheel the Ocean",link:"c3a/3_4_wheel_the_ocean.html"},
    {text:"3/4 Wheel the Sea",link:"c3a/3_4_wheel_the_sea.html"},
    {text:"(Any Tagging Call) Chain Thru",link:"c3a/any_tagging_call_chain_thru.html"},
    {text:"(Any Tagging Call) Reaction",link:"c3a/anything_reaction.html"},
    {text:"Anyone Hop",link:"c3a/anyone_hop.html"},
    {text:"Bias Circulate",link:"c3a/bias_circulate.html"},
    {text:"Big Block Concept",link:"c3a/big_block_concept.html"},
    {text:"Breaker Anything",link:"c3a/breaker_anything.html"},
    {text:"Catch Anything N",link:"c3a/catch_anything_n.html"},
    {text:"Checkerboard Anything",link:"c3a/checkerboard_anything.html"},
    {text:"Checkerbox Anything",link:"c3a/checkerbox_anything.html"},
    {text:"Couple Up",link:"c3a/couple_up.html"},
    {text:"Cross Chain Reaction",link:"c3a/cross_chain_reaction.html"},
    {text:"Cross Counter",link:"c3a/cross_counter.html"},
    {text:"Delight",link:"c3a/delight_dilemma.html"},
    {text:"Dilemma",link:"c3a/delight_dilemma.html"},
    {text:"Drift Apart",link:"c3a/drift_apart.html"},
    {text:"Ease Off",link:"c3a/ease_off.html"},
    {text:"Eight By Anything",link:"c3a/eight_by_anything.html"},
    {text:"Exchange the Box",link:"c3a/exchange_the_box.html"},
    {text:"Exchange the Triangle",link:"c3a/exchange_the_triangle.html"},
    {text:"Expand the Column",link:"c3a/expand_the_column.html"},
    {text:"Explode the Top",link:"c3a/explode_the_top.html"},
    {text:"Fancy",link:"c3a/fancy.html"},
    {text:"Finally Concept",link:"c3a/finally_concept.html"},
    {text:"Flare Out to a Line",link:"c3a/flare_out_to_a_line.html"},
    {text:"Follow to a Diamond",link:"c3a/follow_to_a_diamond.html"},
    {text:"Follow Your Leader",link:"c3a/follow_your_leader.html"},
    {text:"Grand Mix",link:"c3a/grand_mix.html"},
    {text:"Hinge the Lock",link:"c3a/hinge_the_lock.html"},
    {text:"Initially Concept",link:"c3a/initially_concept.html"},
    {text:"Interlocked Little",link:"c3a/interlocked_little.html"},
    {text:"Interlocked Plenty",link:"c3a/interlocked_plenty.html"},
    {text:"Interlocked Scoot Back",link:"c3a/interlocked_scoot_back.html"},
    {text:"Jay Concept",link:"c3a/jay_concept.html"},
    {text:"Keep Busy",link:"c3a/keep_busy.html"},
    {text:"Latch On (Fraction)",link:"c3a/latch_on.html"},
    {text:"Link Up",link:"c3a/link_up.html"},
    {text:"Lock the Hinge",link:"c3a/lock_the_hinge.html"},
    {text:"Locker's Choice",link:"c3a/lockers_choice.html"},
    {text:"Mini Chase",link:"c3a/mini_chase.html"},
    {text:"Once Removed Diamond Concept",link:"c3a/once_removed_diamonds.html"},
    {text:"Open Up the Column",link:"c3a/open_up_the_column.html"},
    {text:"Own the Anyone Anything by Anything",link:"c3a/own_the_anyone_anything_by_anything.html"},
    {text:"Patch Anyone",link:"c3a/patch_anyone.html"},
    {text:"Peel Chain Thru",link:"c3a/peel_chain_thru.html"},
    {text:"Plan Ahead",link:"c3a/plan_ahead.html"},
    {text:"Polly Wally",link:"c3a/polly_wally.html"},
    {text:"Quick Anything",link:"c3a/quick_anything.html"},
    {text:"Quick Step",link:"c3a/quick_step.html"},
    {text:"Rally",link:"c3a/rally.html"},
    {text:"Reach Out",link:"c3a/reach_out.html"},
    {text:"Recoil",link:"c3a/recoil.html"},
    {text:"Release Anything",link:"c3a/release_anything.html"},
    {text:"Reverse Crazy",link:"c3a/reverse_crazy.html"},
    {text:"Scatter Circulate",link:"c3a/scatter_circulate.html"},
    {text:"Scoot the Diamond",link:"c3a/scoot_the_diamond.html"},
    {text:"Single Checkmate",link:"c3a/single_checkmate.html"},
    {text:"Single Concept",link:"c3a/single_concept.html"},
    {text:"Single File Recoil",link:"c3a/single_file_recoil.html"},
    {text:"Single File Recycle",link:"c3a/single_file_recycle.html"},
    {text:"Slant Anything by Anything",link:"c3a/slant_anything_by_anything.html"},
    {text:"Snap the Lock",link:"c3a/snap_the_lock.html"},
    {text:"Something New",link:"c3a/something_new.html"},
    {text:"Spin Chain the Line",link:"c3a/spin_chain_the_line.html"},
    {text:"Spin the Pulley",link:"c3a/spin_the_pulley.html"},
    {text:"Split Phantom Columns/Lines/Waves",link:"c3a/split_phantom_columns_lines_waves_concept.html"},
    {text:"Stable Concept",link:"c3a/stable_concept.html"},
    {text:"Stampede",link:"c3a/stampede.html"},
    {text:"Strip the Diamond",link:"c3a/strip_the_diamond.html"},
    {text:"Strip the Hourglass",link:"c3a/strip_the_hourglass.html"},
    {text:"Swap the Top",link:"c3a/swap_the_top.html"},
    {text:"Swing Chain Thru",link:"c3a/swing_chain_thru.html"},
    {text:"Team Up",link:"c3a/team_up.html"},
    {text:"The Gamut",link:"c3a/the_gamut.html"},
    {text:"Touch By Fraction By Fraction/Anything",link:"c3a/touch_by_fraction_by_fraction_anything.html"},
    {text:"Trade the Deucey",link:"c3a/trade_the_deucey.html"},
    {text:"Travel Thru",link:"c3a/travel_thru.html"},
    {text:"Trip the Set",link:"c3a/trip_the_set.html"},
    {text:"Triple Diamond Concept",link:"c3a/triple_diamond_concept.html"},
    {text:"Triple Play",link:"c3a/triple_play.html"},
    {text:"Wind the Bobbin",link:"c3a/wind_the_bobbin.html"},
    {text:"Wrap to a Formation",link:"c3a/wrap_to_a_formation.html"}]}];
